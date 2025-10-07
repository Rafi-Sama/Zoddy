import { Widget } from "@/types/dashboard"

/**
 * Finds an optimal position for a new widget on the dashboard grid
 * @param existingWidgets - Array of existing widgets
 * @param newWidgetWidth - Width of the new widget
 * @param newWidgetHeight - Height of the new widget
 * @param cols - Total columns in the grid (default 12)
 * @returns Optimal x,y position for the new widget
 */
export function findOptimalPosition(
  existingWidgets: Widget[],
  newWidgetWidth: number,
  newWidgetHeight: number,
  cols: number = 12
): { x: number; y: number } {
  // Create a 2D grid to track occupied spaces
  const maxY = Math.max(0, ...existingWidgets.map(w => w.y + w.h)) + 20;
  const grid: boolean[][] = Array(maxY)
    .fill(null)
    .map(() => Array(cols).fill(false));

  // Mark occupied spaces
  existingWidgets.forEach(widget => {
    for (let y = widget.y; y < widget.y + widget.h; y++) {
      for (let x = widget.x; x < widget.x + widget.w; x++) {
        if (y < maxY && x < cols) {
          grid[y][x] = true;
        }
      }
    }
  });

  // Find the first available position that can fit the widget
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x <= cols - newWidgetWidth; x++) {
      // Check if the widget can fit at this position
      let canFit = true;
      for (let dy = 0; dy < newWidgetHeight; dy++) {
        for (let dx = 0; dx < newWidgetWidth; dx++) {
          if (y + dy >= maxY) {
            // Need to extend the grid
            canFit = true;
            break;
          }
          if (grid[y + dy][x + dx]) {
            canFit = false;
            break;
          }
        }
        if (!canFit) break;
      }

      if (canFit) {
        return { x, y };
      }
    }
  }

  // If no position found in existing grid, place at the bottom
  return { x: 0, y: maxY };
}

/**
 * Checks if two widgets overlap
 */
export function widgetsOverlap(widget1: Widget, widget2: Widget): boolean {
  return !(
    widget1.x + widget1.w <= widget2.x ||
    widget2.x + widget2.w <= widget1.x ||
    widget1.y + widget1.h <= widget2.y ||
    widget2.y + widget2.h <= widget1.y
  );
}

/**
 * Resolves overlapping widgets by moving them to new positions
 */
export function resolveOverlaps(widgets: Widget[]): Widget[] {
  const resolved = [...widgets];
  let hasOverlap = true;
  let iterations = 0;
  const maxIterations = 100;

  while (hasOverlap && iterations < maxIterations) {
    hasOverlap = false;
    iterations++;

    for (let i = 0; i < resolved.length; i++) {
      for (let j = i + 1; j < resolved.length; j++) {
        if (widgetsOverlap(resolved[i], resolved[j])) {
          hasOverlap = true;
          // Move the second widget to a new position
          const { x, y } = findOptimalPosition(
            resolved.filter((_, index) => index !== j),
            resolved[j].w,
            resolved[j].h
          );
          resolved[j] = { ...resolved[j], x, y };
        }
      }
    }
  }

  return resolved;
}

/**
 * Validates if a widget position is within grid bounds
 */
export function isValidPosition(
  widget: Widget,
  cols: number = 12
): boolean {
  return (
    widget.x >= 0 &&
    widget.y >= 0 &&
    widget.x + widget.w <= cols
  );
}

/**
 * Adjusts widget position to fit within grid bounds
 */
export function adjustToGridBounds(
  widget: Widget,
  cols: number = 12
): Widget {
  const adjusted = { ...widget };

  // Adjust x position if widget goes beyond grid width
  if (adjusted.x + adjusted.w > cols) {
    adjusted.x = Math.max(0, cols - adjusted.w);
  }

  // Ensure x is not negative
  if (adjusted.x < 0) {
    adjusted.x = 0;
  }

  // Ensure y is not negative
  if (adjusted.y < 0) {
    adjusted.y = 0;
  }

  return adjusted;
}