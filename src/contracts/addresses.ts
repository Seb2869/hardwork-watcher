import config from '../../config.json'

export class Addresses {
  network: string
  chainId: string
  controller: string
  WETH: string
  profitShare: string
  scanApiUrl: string
  scanUrl: string
  discord: string
  constructor(net: string) {
    if (net == 'polygon') {
      this.network = 'Polygon'
      this.chainId = '137'
      this.controller = '0xebaFc813f66c3142E7993a88EE3361a1f4BDaB16'
      this.WETH = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
      this.profitShare = '0xf00dD244228F51547f0563e60bCa65a30FBF5f7f'
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
      this.WETH = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'
      this.profitShare = '0xf00dD244228F51547f0563e60bCa65a30FBF5f7f'
      this.scanApiUrl =
        'https://api.bscscan.com/api?module=contract&action=getsourcecode&apikey=' +
        config.bsc.scanKey +
        '&address='
      this.scanUrl = 'https://bscscan.com/'
      this.discord = config.bsc.discord
    } else {
      throw Error('Unknown network ' + net)
    }
  }
}
