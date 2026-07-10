/**
 * Controls the visibility of the "Sign here" placeholders rendered for empty
 * signature fields.
 *
 * This is intentionally independent of the annotation editor UI manager: that
 * manager is only created once an editing/signing mode is entered (and not at
 * all for plain viewing), whereas placeholders are rendered as soon as the
 * document loads. Each placeholder registers itself here at render time, and
 * the host (viewer app) restricts signing to a single field — or disables it
 * entirely for read-only / acknowledgement-only views — by driving this
 * controller.
 *
 * Restriction rules applied to every registered field:
 *   - signing disabled → every field hidden;
 *   - an active field id is set → only that field is visible, the rest hidden;
 *   - otherwise → every field is visible.
 */
class SignatureFieldController {
  #fields = new Map();

  #activeFieldId = null;

  #signingEnabled = true;

  /**
   * Register a signature placeholder so it can be shown/hidden by id.
   * Re-registering the same field name (e.g. on re-render) replaces the entry.
   *
   * @param {string} fieldName - the AcroForm field name (its `/T`).
   * @param {Object} entry
   * @param {function(boolean)} entry.setActive - shows (true) or hides (false)
   *   the placeholder.
   */
  register(fieldName, entry) {
    if (!fieldName) {
      return;
    }
    this.#fields.set(fieldName, entry);
    this.#apply();
  }

  /**
   * Restrict signing to a single field. Passing null (or an id matching no
   * registered field) clears the restriction so every field is shown again.
   *
   * @param {string|null} id
   */
  setActiveField(id) {
    this.#activeFieldId = id || null;
    this.#apply();
  }

  /**
   * Enable or disable signing across the whole document. When disabled, every
   * placeholder is hidden. Defaults to enable.
   *
   * @param {boolean} enabled
   */
  setSigningEnabled(enabled) {
    this.#signingEnabled = enabled !== false;
    this.#apply();
  }

  /**
   * Forget the current document's registered fields and its active-field
   * restriction. Called when a document is closed so the per-document state never
   * leaks into the next one. `signingEnabled` is intentionally preserved: it is
   * a viewer-level option (set via enable/disableSignature), not per-document.
   */
  reset() {
    this.#fields.clear();
    this.#activeFieldId = null;
  }

  #apply() {
    const hasTarget =
      this.#activeFieldId !== null && this.#fields.has(this.#activeFieldId);
    for (const [fieldName, entry] of this.#fields) {
      const active =
        this.#signingEnabled &&
        (!hasTarget || fieldName === this.#activeFieldId);
      entry.setActive?.(active);
    }
  }
}

const signatureFieldController = new SignatureFieldController();

export { SignatureFieldController, signatureFieldController };
