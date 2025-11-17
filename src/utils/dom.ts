/**
 * Shared DOM utility functions
 * Provides common patterns for DOM manipulation and event handling
 */

/**
 * Initializes a callback when DOM is ready
 * Handles both pre-loaded and loading states
 * @param callback - Function to execute when DOM is ready
 */
export function initOnDOM(callback: () => void): void {
	if (typeof window === 'undefined') {
		console.warn('[DOM] Called in non-browser environment');
		return;
	}

	try {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', callback);
		} else {
			// DOM already loaded, execute immediately
			callback();
		}
	} catch (error) {
		console.error('[DOM] Failed to initialize:', error);
	}
}

/**
 * Initializes chip/button selection behavior for option groups
 * Only one option can be selected at a time within a group
 * @param root - Root element containing the chip groups
 */
export function initChipSelection(root: Element | null): void {
	if (!root) {
		console.warn('[ChipSelection] Root element not provided');
		return;
	}

	try {
		root.addEventListener('click', (e) => {
			const target = e.target;
			if (!(target instanceof HTMLElement)) return;

			const btn = target.closest('button.chip-option');
			if (!btn) return;

			const group = btn.closest('.product-panels__option-group, .product-sheets__option-group');
			if (!group) return;

			// Deselect all options in the group
			group.querySelectorAll('button.chip-option').forEach((b) => {
				b.setAttribute('aria-pressed', 'false');
			});

			// Select clicked option
			btn.setAttribute('aria-pressed', 'true');
		});
	} catch (error) {
		console.error('[ChipSelection] Failed to initialize:', error);
	}
}

/**
 * Safely queries a DOM element with type checking
 * @param selector - CSS selector
 * @param context - Context element to query from (defaults to document)
 * @returns Element or null if not found
 */
export function safeQuerySelector<T extends Element = Element>(
	selector: string,
	context: Document | Element = document
): T | null {
	try {
		return context.querySelector<T>(selector);
	} catch (error) {
		console.error(`[DOM] Failed to query selector "${selector}":`, error);
		return null;
	}
}

/**
 * Safely queries multiple DOM elements
 * @param selector - CSS selector
 * @param context - Context element to query from (defaults to document)
 * @returns NodeList of elements (empty if query fails)
 */
export function safeQuerySelectorAll<T extends Element = Element>(
	selector: string,
	context: Document | Element = document
): NodeListOf<T> {
	try {
		return context.querySelectorAll<T>(selector);
	} catch (error) {
		console.error(`[DOM] Failed to query selector "${selector}":`, error);
		// Return empty NodeList-like object
		return {
			length: 0,
			item: () => null,
			forEach: () => {},
			entries: () => [][Symbol.iterator](),
			keys: () => [][Symbol.iterator](),
			values: () => [][Symbol.iterator](),
			[Symbol.iterator]: () => [][Symbol.iterator](),
		} as NodeListOf<T>;
	}
}

/**
 * Creates a debounced version of a function
 * Useful for resize/scroll event handlers
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

/**
 * Type guard to check if element is an HTMLElement
 * @param element - Element to check
 * @returns True if element is HTMLElement
 */
export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

/**
 * Removes event listener safely and logs if fails
 * @param element - Element to remove listener from
 * @param event - Event type
 * @param handler - Event handler
 */
export function safeRemoveEventListener(
	element: Element | Window,
	event: string,
	handler: EventListener
): void {
	try {
		element.removeEventListener(event, handler);
	} catch (error) {
		console.error(`[DOM] Failed to remove event listener for "${event}":`, error);
	}
}
