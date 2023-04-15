import config from '../../config.json'

export class Addresses {
  network: string
  chainId: string
  controller: string
  profitToken: string
  profitTokenName: string
  profitShare: string
  scanApiUrl: string
  scanUrl: string
  discord: string
  constructor(net: string) {
    if (net == 'eth') {
      this.network = 'Ethereum'
      this.chainId = '1'
      this.controller = '0x3cC47874dC50D98425ec79e647d83495637C55e3'
      this.profitToken = '0xa0246c9032bC3A600820415aE600c6388619A14D'
      this.profitTokenName = 'FARM'
      this.profitShare = '0x8f5adC58b32D4e5Ca02EAC0E293D35855999436C'
      this.scanApiUrl =
        'https://api.etherscan.io/api?module=contract&action=getsourcecode&apikey=' +
        config.eth.scanKey +
        '&address='
      this.scanUrl = 'https://etherscan.io/'
      this.discord = config.eth.discord
    } else if (net == 'polygon') {
      this.network = 'Polygon'
      this.chainId = '137'
      this.controller = '0xebaFc813f66c3142E7993a88EE3361a1f4BDaB16'
      this.profitToken = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
      this.profitTokenName = 'WETH'
      this.profitShare = '0xF066789028fE31D4f53B69B81b328B8218Cc0641'
      this.scanApiUrl =
        'https://api.polygonscan.com/api?module=contract&action=getsourcecode&apikey=' +
        config.polygon.scanKey +
        '&address='
      this.scanUrl = 'https://polygonscan.com/'
      this.discord = config.polygon.discord
    } else if (net == 'bsc') {
      this.network = 'BSC'
      this.chainId = '56'
      this.controller = '0x222412af183BCeAdEFd72e4Cb1b71f1889953b1C'
      this.profitToken = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'
      this.profitTokenName = 'WETH'
      this.profitShare = '0xf00dD244228F51547f0563e60bCa65a30FBF5f7f'
      this.scanApiUrl =
        'https://api.bscscan.com/api?module=contract&action=getsourcecode&apikey=' +
        config.bsc.scanKey +
        '&address='
      this.scanUrl = 'https://bscscan.com/'
      this.discord = config.bsc.discord
    } else if (net == 'arbitrum') {
      this.network = 'Arbitrum'
      this.chainId = '42161'
      this.controller = '0x68B2FC1566f411C1Af8fF5bFDA3dD4F3F3e59D03'
      this.profitToken = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
      this.profitTokenName = 'WETH'
      this.profitShare = '0xf3D1A027E858976634F81B7c41B09A05A46EdA21'
      this.scanApiUrl =
        'https://api.arbiscan.io/api?module=contract&action=getsourcecode&apikey=' +
        config.arbitrum.scanKey +
        '&address='
      this.scanUrl = 'https://arbiscan.io/'
      this.discord = config.arbitrum.discord
    } else {
      throw Error('Unknown network ' + net)
    }
  }
}
