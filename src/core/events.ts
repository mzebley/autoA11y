/**
 * Dispatch a typed CustomEvent with sensible defaults for library patterns.
 *
 * Conventions:
 * - Event names follow `automagica11y:<pattern>:<action>` when applicable.
 * - Events bubble and are composed by default so plugins can observe them.
 * - Set `cancelable: true` when downstream listeners may prevent default behavior.
 */
export interface DispatchOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

export function dispatch<TDetail>(
  target: HTMLElement,
  type: string,
  detail: TDetail,
  options: DispatchOptions = {}
) {
  const { bubbles = true, cancelable = false, composed = true } = options;
  const evt = new CustomEvent<TDetail>(type, { detail, bubbles, cancelable, composed });
  target.dispatchEvent(evt);
  return evt;
}
