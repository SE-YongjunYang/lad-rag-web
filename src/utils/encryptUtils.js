 
import JSEncrypt from 'jsencrypt';
 
// 可能需要需要先安装jsencrypt库，执行：npm install jsencrypt 
 
/**
 * 登录使用的公钥，
 * 如果想灵活一点，可以把公钥放在后端，前端通过接口查询得到公钥。
 * @type {string}
 */
const LOGIN_PUBLIC_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrHdD6gyat5BGdGMfzwg3k5/1bx/X3LFYBjkC1MUOJqvYjp2Jew+YxoKGzu22bH8+YpGsHrB5sIbxthPmS80l6VfCQ86bUJTVbS/sdyEWr5IYCHwu++raxMZcH79ANjWGste2XJRRssb12DvZxip6ZhedPwa88ykajrgdDErI6TwIDAQAB";
 
 
 
/**
 * 获取登录使用的公钥
 * @returns {string}
 */
export const getLoginPublicKey = () => {
  return LOGIN_PUBLIC_KEY;
}
 
 
/**
 * 加密
 * @param text  需要加密的文本
 * @param publicKey   公钥
 * @returns {string | false}
 */
// export const encodeStr = (text, publicKey) => {
//   // RSA（非对称加密）
//   const JSE = new JSEncrypt();
//   // 设置公钥
//   JSE.setPublicKey(publicKey);
//   return JSE.encrypt(text);
// }
export const encodeStr = (text) => {
    // RSA（非对称加密）
    const JSE = new JSEncrypt();
    // 设置公钥
    JSE.setPublicKey(getLoginPublicKey());
    return JSE.encrypt(text);
  }