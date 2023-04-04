export const rageSave = (function () {
    let markerTextChar = '\ufeff';
    let selectionHasExtend = (typeof window.getSelection().extend !== 'undefined');

    function gEBI (id, doc) {
        return (doc || document).getElementById(id);
    }

    function removeNode (node) {
        node.parentNode.removeChild(node);
    }

    // Utility function to support direction parameters in the API that may be a string ("backward", "backwards",
    // "forward" or "forwards") or a Boolean (true for backwards).
    function isDirectionBackward (dir) {
        return (typeof dir === 'string') ? /^backward(?:s)?$/i.test(dir) : !!dir;
    }

    function isSelectionBackward (sel) {
        let backward = false;
        if (!sel.isCollapsed) {
            let range = document.createRange();
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);
            backward = range.collapsed;
        }
        return backward;
    }

    function selectRangeBackwards (sel, range) {
        if (selectionHasExtend) {
            let endRange = range.cloneRange();
            endRange.collapse(false);
            sel.removeAllRanges();
            sel.addRange(endRange);
            sel.extend(range.startContainer, range.startOffset);
            return true;
        }
        // Just select the range forwards
        sel.removeAllRanges();
        sel.addRange(range);
        return false;
    }

    function insertRangeBoundaryMarker (range, atStart) {
        let markerId = 'selectionBoundary_' + (+new Date()) + '_' + ('' + Math.random()).slice(2);
        let markerEl;
        let doc = range.startContainer.ownerDocument;

        // Clone the Range and collapse to the appropriate boundary point
        let boundaryRange = range.cloneRange();
        boundaryRange.collapse(atStart);

        // Create the marker element containing a single invisible character using DOM methods and insert it
        markerEl = doc.createElement('span');
        markerEl.id = markerId;
        markerEl.style.lineHeight = '0';
        markerEl.style.display = 'none';
        markerEl.textContent = markerTextChar;

        boundaryRange.insertNode(markerEl);
        return markerEl;
    }

    function setRangeBoundary (doc, range, markerId, atStart) {
        let markerEl = gEBI(markerId, doc);
        if (markerEl) {
            range[atStart ? 'setStartBefore' : 'setEndBefore'](markerEl);
            removeNode(markerEl);
        }
    }

    function compareRanges (r1, r2) {
        return r2.compareBoundaryPoints(r1.START_TO_START, r1);
    }

    function saveRange (range, direction) {
        let startEl;
        let endEl;
        let doc = range.startContainer.ownerDocument;
        let text = range.toString();

        if (range.collapsed) {
            endEl = insertRangeBoundaryMarker(range, false);
            return {
                document: doc,
                markerId: endEl.id,
                collapsed: true
            };
        }
        endEl = insertRangeBoundaryMarker(range, false);
        startEl = insertRangeBoundaryMarker(range, true);

        return {
            document: doc,
            startMarkerId: startEl.id,
            endMarkerId: endEl.id,
            collapsed: false,
            backward: isDirectionBackward(direction),
            toString: function () {
                return 'original text: \'' + text + '\', new text: \'' + range.toString() + '\'';
            }
        };
    }

    function restoreRange (rangeInfo) {
        let doc = rangeInfo.document;
        let range = doc.createRange(doc);
        if (rangeInfo.collapsed) {
            let markerEl = gEBI(rangeInfo.markerId, doc);
            if (markerEl) {
                markerEl.style.display = 'inline';
                let previousNode = markerEl.previousSibling;

                if (previousNode && previousNode.nodeType === 3) {
                    removeNode(markerEl);
                    range.setStart(previousNode, previousNode.length);
                    range.collapse(true);
                } else {
                    range.setEndBefore(markerEl);
                    range.collapse(false);
                    removeNode(markerEl);
                }
            } else {
                console.warn('Marker element has been removed. Cannot restore selection.');
            }
        } else {
            setRangeBoundary(doc, range, rangeInfo.startMarkerId, true);
            setRangeBoundary(doc, range, rangeInfo.endMarkerId, false);
        }

        return range;
    }

    function saveRanges (ranges, direction) {
    // Order the ranges by position within the DOM, latest first, cloning the array to leave the original untouched
        ranges = ranges.slice(0);
        ranges.sort(compareRanges);
        let backward = isDirectionBackward(direction);

        let rangeInfos = ranges.map(function (range) {
            return saveRange(range, backward);
        });

        // Now that all the markers are in place and DOM manipulation is over, adjust each range's boundaries to lie
        // between its markers
        for (let i = ranges.length - 1, range, doc; i >= 0; --i) {
            range = ranges[i];
            doc = range.startContainer.ownerDocument;
            if (range.collapsed) {
                range.setStartAfter(gEBI(rangeInfos[i].markerId, doc));
                range.collapse(true);
            } else {
                range.setEndBefore(gEBI(rangeInfos[i].endMarkerId, doc));
                range.setStartAfter(gEBI(rangeInfos[i].startMarkerId, doc));
            }
        }

        return rangeInfos;
    }

    function saveSelection (win) {
        win = win || window;
        let sel = win.getSelection();
        let ranges = [];
        for (let i = 0; i < sel.rangeCount; ++i) {
            ranges.push(sel.getRangeAt(i));
        }
        let backward = (ranges.length === 1 && isSelectionBackward(sel));
        let rangeInfos = saveRanges(ranges, backward);

        // Ensure current selection is unaffected
        sel.removeAllRanges();
        if (backward) {
            selectRangeBackwards(sel, ranges[0]);
        } else {
            ranges.forEach(function (range) {
                sel.addRange(range);
            });
        }

        return {
            win,
            rangeInfos,
            restored: false
        };
    }

    function restoreRanges (rangeInfos) {
        let ranges = [];

        // Ranges are in reverse order of appearance in the DOM. We want to restore earliest first to avoid
        // normalization affecting previously restored ranges.
        let rangeCount = rangeInfos.length;

        for (let i = rangeCount - 1; i >= 0; i--) {
            ranges[i] = restoreRange(rangeInfos[i], true);
        }

        return ranges;
    }

    function restoreSelection (savedSelection, preserveDirection) {
        if (!savedSelection.restored) {
            let rangeInfos = savedSelection.rangeInfos;
            let sel = savedSelection.win.getSelection();
            let ranges = restoreRanges(rangeInfos);
            let rangeCount = rangeInfos.length;

            sel.removeAllRanges();
            if (rangeCount === 1 && preserveDirection && selectionHasExtend && rangeInfos[0].backward) {
                selectRangeBackwards(sel, ranges[0]);
            } else {
                ranges.forEach(function (range) {
                    sel.addRange(range);
                });
            }

            savedSelection.restored = true;
        }
    }

    function removeMarkerElement (doc, markerId) {
        let markerEl = gEBI(markerId, doc);
        if (markerEl) {
            removeNode(markerEl);
        }
    }

    function removeMarkers (savedSelection) {
        savedSelection.rangeInfos.forEach(function (rangeInfo) {
            if (rangeInfo.collapsed) {
                removeMarkerElement(savedSelection.doc, rangeInfo.markerId);
            } else {
                removeMarkerElement(savedSelection.doc, rangeInfo.startMarkerId);
                removeMarkerElement(savedSelection.doc, rangeInfo.endMarkerId);
            }
        });
    }

    return {
        saveRange,
        restoreRange,
        saveRanges,
        restoreRanges,
        saveSelection,
        restoreSelection,
        removeMarkerElement,
        removeMarkers
    };
})();
