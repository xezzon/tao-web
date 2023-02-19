import RequestInstance from "./RequestInstance"

/**
 * 创建请求实例 同一实例会共享一些配置 通常一个实例对应一个后端服务
 */
function create(instanceConfig = {}) {
  return new RequestInstance(instanceConfig)
}

export default { create }
