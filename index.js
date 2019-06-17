import makeShadow from 'shadow-callbag'

const fromFetch = (input, init) => async (start, sink) => {
  if (start !== 0) return

  const controller = new AbortController()
  const signal = controller.signal
  let outerSignalHandler
  let abortable = true
  let unsubscribed = false

  if (init) {
    // If a signal is provided, just have it teardown. It's a cancellation token, basically.
    if (init.signal) {
      outerSignalHandler = () => {
        if (!signal.aborted) {
          controller.abort()
        }
      }
      init.signal.addEventListener('abort', outerSignalHandler)
    }
    init.signal = signal
  } else {
    init = { signal }
  }

  const shadow = makeShadow('fromFetch')

  try {
    const response = await fetch(input, init)
    abortable = false
    shadow(1, response)
    sink(1, response)
  } catch (error) {
    abortable = false
    if (!unsubscribed) {
      // Only forward the error if it wasn't an abort.
      sink(2, error)
    }
  }

  sink(
    0,
    t => {
      if (t === 2) {
        unsubscribed = true
        if (abortable) {
          controller.abort()
        }
      }
    },
    shadow
  )
}

export default fromFetch
