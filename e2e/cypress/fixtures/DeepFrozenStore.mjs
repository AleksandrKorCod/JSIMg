// eslint-disable-next-line import/no-extraneous-dependencies
import deepFreeze from 'deep-freeze'

/* eslint-disable no-underscore-dangle */

/**
 * Default store + deepFreeze on setState to make sure nothing is mutated accidentally
 */
class DeepFrozenSt {
  constructor () {
    this.state = {}
    this.callbacks = []
  }

  getState = () => this.state;

  setState (patch) {
    const nextState = deepFreeze({ ...this.state, ...patch });

    this._publish(this.state, nextState, patch)
    this.state = nextState

  }

  subscribe (listener) {
    this.callbacks.push(listener)
    return () => {
      // Remove the listener.
      this.callbacks.splice(
        this.callbacks.indexOf(listener),
        1,
      )
    }
  }

  _publish (...args) {
    this.callbacks.forEach((listener) => {
      listener(...args)
    })
  }
}

export default function defaultStore () {
  return new DeepFrozenSt()
}
