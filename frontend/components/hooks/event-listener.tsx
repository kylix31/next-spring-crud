import { useEffect, useRef } from "react"

/**
 * A custom hook that creates a custom event and returns a function to dispatch it.
 * @param eventName - The name of the custom event to create.
 * @param eventData - The data to include in the custom event.
 * @returns A function that dispatches the custom event.
 */
export function useCustomEvent(eventName: string, eventData: any) {
  const eventRef = useRef<CustomEvent | null>(null)

  useEffect(() => {
    // Create the custom event
    const event = new CustomEvent(eventName, { detail: eventData })
    eventRef.current = event

    // Clean up the event when the component unmounts
    return () => {
      eventRef.current = null
    }
  }, [eventName, eventData])

  function dispatchCustomEvent() {
    if (eventRef.current) {
      document.dispatchEvent(eventRef.current)
    }
  }

  return dispatchCustomEvent
}

/**
 * Adds a custom event listener to the document and executes a callback function when the event is triggered.
 *
 * @param {string} eventName - The name of the custom event to listen for.
 * @param {(data: any) => void} eventHandler - The callback function to execute when the custom event is triggered. The function should accept a single parameter, which is the data passed with the custom event.
 *
 * @returns {void}
 */
export function useCustomEventTrigger(
  eventName: string,
  eventHandler: (data: any) => void
) {
  useEffect(() => {
    // Add event listener to listen for the custom event
    const handleCustomEvent = (event: Event) => {
      if (event.type === eventName) {
        eventHandler((event as CustomEvent).detail)
      }
    }

    document.addEventListener(eventName, handleCustomEvent)

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener(eventName, handleCustomEvent)
    }
  }, [eventName, eventHandler])
}
