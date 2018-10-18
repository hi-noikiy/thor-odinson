import { autorun, computed, observable, runInAction } from 'mobx'

/**
 * form faker in mobx
 */
type FormItemStateError = {[P in keyof IFormItemRule]: boolean}
type FormItemRuleFunc = (callback: (err: Error) => void) => void
type InputType = INPUT.RADIO | INPUT.CHECKBOX | INPUT.TEXT | INPUT.SELECT
type FormItemStateErrorTypes = keyof IFormItemRule

enum INPUT {
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  TEXT = 'text',
  SELECT = 'select',
}

export interface IForm extends IFormState {
  items: Map<any, IFormItem>
  clear: () => void
  addFormItem: (item: IFormItem) => void
  submit: () => void
  validateForm: () => void
}
interface IFormGenericState {
  readonly valid: boolean
  readonly invalid: boolean
  pristine: boolean
  dirty: boolean
}

interface IFormItemState extends IFormGenericState {
  errors: FormItemStateError
}

interface IFormState extends IFormGenericState {
  submitted: boolean
  errors: any
}

export interface IFormItem extends IFormGenericState {
  name: string
  type: InputType
  rules: IFormItemRule[] | FormItemRuleFunc
  item: any
  vals: any
  prevVals: any
  errors: FormItemStateError
  change(val: any): void
}

interface IFormItemRule {
  required?: boolean
  min?: number
  max?: number
  minlength?: number
  maxlength?: number
  pattern?: RegExp
  custom?: (...args: any[]) => any
}

export abstract class FormItem implements IFormItemState, IFormItem {
  @computed get valid(): boolean {
    return !Object.keys(this.errors).length
  }
  @computed get invalid(): boolean {
    return !this.valid
  }
  @observable public errors: FormItemStateError = {}
  @observable public pristine = true
  @observable public dirty = false
  @observable public vals: any
  public name: string
  public type: InputType
  public rules: IFormItemRule[] | FormItemRuleFunc
  public item: any
  public prevVals: any

  constructor(name: string, type: InputType, item: any, rules: IFormItemRule[] | FormItemRuleFunc) {
    this.name = name
    this.type = type
    this.item = item
    this.rules = rules
  }

  public change(v: any) {}
}

export class TextFormItem extends FormItem {
  @observable public disable: boolean

  constructor(name: string, item: any, rules: IFormItemRule[] | FormItemRuleFunc, val: string = '') {
    super(name, INPUT.TEXT, item, rules)
    this.vals = val
    this.disable = false
  }

  public change(v: string) {
    if (this.disable) {
      return
    }
    this.vals = v
  }
}

export class RadioOption {
  @observable public value: string
  @observable public selected: boolean
  @observable public disable: boolean

  constructor(value: string, selected: boolean = false) {
    this.value = value
    this.selected = selected
    this.disable = false
  }
}

export interface IRadioFormItem extends IFormItem {
  options: RadioOption[]
}

export class RadioFormItem extends FormItem implements IRadioFormItem {
  @observable public disable: boolean
  public options: RadioOption[]

  constructor(name: string, item: any, rules: IFormItemRule[] | FormItemRuleFunc) {
    super(name, INPUT.RADIO, item, rules)
    this.options = []
    this.disable = false
  }

  public click(option: RadioOption) {
    if (option.disable) {
      return
    }
    this.change(option.value)
  }

  public change(v: string) {
    for (const o of this.options) {
      if (o.value === v) {
        o.selected = true
        this.vals = v
        continue
      }
      o.selected = false
    }
    this.vals = v
  }

  public addOption(option: RadioOption) {
    this.options.push(option)
    if (option.selected) {
      this.vals = option.value
    }
  }

  public removeOption(option: RadioOption) {
    for (let i = 0, len = this.options.length; i < len; i++) {
      const o = this.options[i]
      if (o.value === option.value) {
        this.options.splice(i, 1)
        return
      }
    }
  }
}

export class Form implements IForm {
  @computed get valid(): boolean {
    return !Object.keys(this.errors).length
  }
  @computed get invalid(): boolean {
    return !this.valid
  }
  @observable public pristine = true
  @observable public dirty = false
  @observable public errors: any = {}
  @observable public submitted = false

  public items: Map<any, IFormItem>

  constructor() {
    this.items = new Map<any, IFormItem>()
  }

  public clear() {
    // @todo
  }

  public addFormItem(fi: IFormItem) {
    const item = fi.item
    this.items.set(item, fi)
    fi.prevVals = fi.vals

    autorun(() => {
      if (fi.prevVals !== fi.vals) {
        runInAction(() => {
          fi.pristine = false
          fi.dirty = true
          this.pristine = false
          this.dirty = true
        })
      }
      if (!fi || fi.pristine) {
        return
      }
      this.validateFormItem(fi).then((err: FormItemStateError) => {
        if (Object.keys(err).length) {
          this.errors[fi.item] = { ...this.errors[fi.item], ...err }
          return
        }
        delete this.errors[fi.item]
      })
    })
  }

  public async validateFormItem(fi: IFormItem): Promise < any > {
    const errors: FormItemStateError = {}
    if (typeof fi.rules === 'function') {
      try {
        await buildInRules.validateAsync(fi.vals, fi.rules, 'custom')
        delete fi.errors.custom
      } catch (err) {
        fi.errors.custom = true
        errors.custom = err.message
      }
    } else {
      for (const rule of fi.rules) {
        for (const rn of Object.keys(rule)) {
          const rnn = rn as FormItemStateErrorTypes
          const r = rule[rnn]
          const vali = buildInRules[rnn + 'Async']
          try {
            await vali(fi.vals, r, rnn)
            delete fi.errors[rnn]
          } catch (err) {
            fi.errors[rnn] = true
            errors[rnn] = err.message
          }
        }
      }
    }
    return errors
  }

  public async submit() {
    this.submitted = true
    const err = await this.validateForm()
    if (err) {
      this.pristine = true
      this.dirty = false
    }
  }

  public async validateForm() {
    for (const [_, fi] of this.items.entries()) {
      const errors = await this.validateFormItem(fi)
      if (!Object.keys(errors).length) {
        delete this.errors[fi.item]
        continue
      }
      this.errors[fi.item] = errors
    }
    if (Object.keys(this.errors).length) {
      return
    }
    return true
  }
}

const buildInRules: any = {
  required: (vals: any, expect: any, rn: string, cb: (err: Error | null) => void) => {
    if (vals && vals.trim() !== '') {
      return cb(null)
    }
    return cb(new Error(`${rn}: required`))
  },

  max: (vals: any, expect: any, rn: string, cb: (err: Error | null) => void) => {
    if (expect >= parseInt(vals)) {
      return cb(null)
    }
    return cb(new Error(`${rn}: ${vals} out of max of ${expect}`))
  },

  min: (vals: any, expect: any, rn: string, cb: (err: Error | null) => void) => {
    if (expect <= parseInt(vals)) {
      return cb(null)
    }
    return cb(new Error(`${rn} ${vals} out of min of ${expect}`))
  },

  maxlength: (vals: any, expect: any, rn: string, cb: (err: Error | null) => void) => {
    if (expect >= vals.length) {
      return cb(null)
    }
    return cb(new Error(`${rn} ${vals} out of maxlength of ${expect}`))
  },

  minlength: (vals: any, expect: any, rn: string, cb: (err: Error | null) => void) => {
    if (expect <= vals.length) {
      return cb(null)
    }
    return cb(new Error(`${rn} ${vals} out of minlength of ${expect}`))
  },

  pattern: (vals: any, expect: any, rn: string, cb: (err: Error | null) => void) => {
    if (expect.test(vals)) {
      return cb(null)
    }
    return cb(new Error(`${rn} ${vals} no match pattern of ${expect}`))
  },

  validate: (vals: any, handle: (vals: any, hd: (err: Error | null) => void) => void, rn: string, cb: (err: Error | null) => void) => {
    handle(vals, err => {
      if (err) {
        return cb(new Error(`${rn} ${err && err.message}`))
      }
      return cb(null)
    })
  },
}

const PromisifiAll = (o: any) => {
  for (const k of Object.keys(o)) {
    const m = o[k]
    if (typeof m === 'function') {
      o[k + 'Async'] = (...args: any[]) => {
        return new Promise((resolve, reject) => {
          m.apply(o, args.concat((err: Error | null) => {
            if (err) {
              return reject(err)
            }
            return resolve()
          }))
        })
      }
    }
  }
  return o
}

PromisifiAll(buildInRules)
