/**
 * Creates a custom event with the given event name and optional event data, and dispatches it to the document.
 *
 * @param eventName - The name of the custom event to create and dispatch.
 * @param eventData - Optional data to include with the custom event.
 * @throws {Error} If the event name is not a string.
 * @returns void
 */
export function funcCreateCustomEvent(
  eventName: string,
  eventData?: any
): void {
  if (typeof eventName !== "string") {
    throw new Error("Event name must be a string.")
  }
  const customEvent = new CustomEvent(eventName, { detail: eventData })
  document.dispatchEvent(customEvent)
}

/**
 * Triggers a custom event with the given event name, and dispatches it to the document.
 *
 * @param eventName - The name of the custom event to trigger and dispatch.
 * @throws {Error} If the event name is not a string.
 * @returns void
 */
export function funcTriggerCustomEvent(eventName: string): void {
  if (typeof eventName !== "string") {
    throw new Error("Event name must be a string.")
  }
  const customEvent = new Event(eventName)
  document.dispatchEvent(customEvent)
}
