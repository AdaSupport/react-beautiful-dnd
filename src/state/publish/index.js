// @flow
import type {
  DragImpact,
  DimensionMap,
  DraggingState,
  CollectingState,
  DropPendingState,
  Publish,
} from '../../types';
import getDragImpact from '../get-drag-impact';
import getHomeImpact from '../get-home-impact';

type Args = {|
  state: CollectingState | DropPendingState,
  publish: Publish
|}

export default ({
  state,
  publish,
}: Args): DraggingState | DropPendingState => {
  // TODO: everything
  const additions: DimensionMap = publish.additions;
  // const removals = publish.removals;

  // ## Adding Draggables to existing lists
  // Added dimension is already in the correct location
  // If added to the end of the list then everything else is in the correct spot
  // If inserted within the list then everything else in the list has been pushed forward
  // by the size of the addition
  // If inserted before the critical draggable then everything initial and current DragPositions
  // need to be updated.

  // ## Removing Draggables from existing lists
  // Added dimension is already in the correct location
  // If removed from the end of the list - nothing to do
  // If removed from within a list then everything else is pulled forward
  // If removed before critical dimension then DragPositions need to be updated

  // ## Adding a new droppable
  // Addition already in right spot

  // ## Adding a Draggable to a new Droppable
  // Addition already in right spot

  const dimensions: DimensionMap = {
    draggables: {
      ...state.dimensions.draggables,
      ...additions.draggables,
    },
    droppables: {
      ...state.dimensions.droppables,
      ...additions.droppables,
    },
  };

  const impact: DragImpact = getDragImpact({
    pageBorderBoxCenter: state.current.page.borderBoxCenter,
    draggable: dimensions.draggables[state.critical.draggable.id],
    draggables: dimensions.draggables,
    droppables: dimensions.droppables,
    previousImpact: getHomeImpact(state.critical, dimensions),
    viewport: state.viewport,
  });

  const draggingState: DraggingState = {
    // appeasing flow
    phase: 'DRAGGING',
    ...state,
    // eslint-disable-next-line
      phase: 'DRAGGING',
    impact,
    dimensions,
  };

  if (state.phase === 'COLLECTING') {
    return draggingState;
  }

  // There was a DROP_PENDING
  // Staying in the DROP_PENDING phase
  // setting isWaiting for false

  const dropPending: DropPendingState = {
    // appeasing flow
    phase: 'DROP_PENDING',
    ...draggingState,
    // eslint-disable-next-line
    phase: 'DROP_PENDING',
    // No longer waiting
    reason: state.reason,
    isWaiting: false,
  };

  return dropPending;
};

