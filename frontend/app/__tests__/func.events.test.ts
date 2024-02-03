//@ts-ignore
import {
  funcCreateCustomEvent,
  funcTriggerCustomEvent,
} from "@/components/helpers/function-custom-events"

describe("funcCreateCustomEvent", () => {
  it("should create and dispatch a custom event with event data", () => {
    const eventName = "customEvent"
    const eventData = { message: "Hello!" }

    funcCreateCustomEvent(eventName, eventData)

    // Write your assertions here
  })

  it("should throw an error if the event name is not a string", () => {
    const eventName = 123
    const eventData = { message: "Hello!" }

    expect(() => {
      funcCreateCustomEvent(eventName, eventData)
    }).toThrow("Event name must be a string.")

    // Write additional assertions if needed
  })
})

describe("funcTriggerCustomEvent", () => {
  it("should trigger and dispatch a custom event", () => {
    const eventName = "customEvent"

    funcTriggerCustomEvent(eventName)

    // Write your assertions here
  })

  it("should throw an error if the event name is not a string", () => {
    const eventName = 123

    expect(() => {
      funcTriggerCustomEvent(eventName)
    }).toThrow("Event name must be a string.")

    // Write additional assertions if needed
  })
})
