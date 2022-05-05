/**
 *  @description 定义useStore的类型
 */
import modules from '../modules'

/* Getter/Commit/Dispatch 智能提示处理 */
// gettters[模块名/方法]、commit[模块名/方法]、dispatch[模块名/方法]
// ts4.1 以上支持 模板字符串语法，需要安装最新的 yarn typescript（目前yarn add typescript@next）
// 传入的是 keyof 有可能是symbol | number,所以 P & string 取其中的string
type Prefix<I, J> = `${I & string}/${J & string}`

// 获取 key 所对应的函数
type GetFunc<M, ModuleName, AttrName> = M[ModuleName & keyof M][AttrName &
  keyof M[ModuleName & keyof M]]

// eg: 获取 "user/getterToken"
type GetNamespacedModuleKey<M> = {
  [P in keyof M]: Prefix<P, keyof M[P]>
}[keyof M]

// eg: 先获取 {"user/getterToken": (state: AppModuleState) => string[]} 然后在转化为 {"user/getterToken": string[]}
type GetNamespacedModule<M> = {
  [P in GetNamespacedModuleKey<M>]: P extends `${infer J}/${infer K}`
    ? GetFunc<M, J, K>
    : unknown
}

// 获取getters的类型
type GetGetterType<T> = T extends { getters: infer K } ? K : unknown
type GetGettersType<M> = {
  [P in keyof M]: GetGetterType<M[P]>
}
type ModuleGetters = GetGettersType<typeof modules>

type GenerateModuleGetters = GetNamespacedModule<ModuleGetters>

export type Getters = {
  [P in keyof GenerateModuleGetters]: ReturnType<GenerateModuleGetters[P]>
}

// 获取mutations类型
type GetMutation<T> = T extends { mutations: infer K } ? K : unknown
type GetMutationsType<M> = {
  [P in keyof M]: GetMutation<M[P]>
}
type ModuleMutations = GetMutationsType<typeof modules>

type generateModuleMutations = GetNamespacedModule<ModuleMutations>

/**
 * 得到
 * type DefineModuleMutations = {
      "app/SET_APP_MODULE_NAME": string[];
      "user/SET_TOKEN": string;
      "user/SET_USER_INFO": Record<string, any>;
  }
 */
type DefineModuleMutations = {
  [P in keyof generateModuleMutations]: Parameters<
    generateModuleMutations[P]
  >[1]
}

// 获取 Commit
interface GetCommit<T> {
  <K extends keyof T>(mutation: K, params?: T[K]): void
}
export type Commit = GetCommit<DefineModuleMutations>

// 获取 actions 类型
type GetAction<T> = T extends { actions: infer K } ? K : unknown
type GetActionsType<M> = {
  [P in keyof M]: GetAction<M[P]>
}
type ModuleActions = GetActionsType<typeof modules>

type generateModuleActions = GetNamespacedModule<ModuleActions>

type DefineModuleActions = {
  [P in keyof generateModuleActions]: {
    params: Parameters<generateModuleActions[P]>[1]
    resType: ReturnType<generateModuleActions[P]>
  }
}

// 获取 Dispatch
interface getDispatch<T> {
  <P extends keyof T>(
    dispatch: P,
    params: T[P]['params' & keyof T[P]],
  ): T[P]['resType' & keyof T[P]]
}
export type Dispatch = getDispatch<DefineModuleActions>
