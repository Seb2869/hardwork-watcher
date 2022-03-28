import { Utils } from './'
import axios from 'axios'

const NAME = 'Farmer Chad'
const AVATAR = 'https://i.ibb.co/qxkL7cC/chad-icon.png'
const HEADERS = {
  'Content-type': 'application/json',
}

const rateLimit = 400

export class DiscordSender {
  private static lastSentMessageTs = 0

  public static async sendHardWork(msg: string, url: string) {
    const params = {
      username: NAME,
      avatar_url: AVATAR,
      embeds: [
        {
          color: 16776960,
          description: msg,
        },
      ],
    }
    await DiscordSender.send(url, params)
  }

  private static async send(url: string, params: any) {
    if (url && url !== '') {
      if (DiscordSender.lastSentMessageTs + rateLimit > Date.now()) {
        console.log('rate limit reached with limit ms:', rateLimit)
        await Utils.sleep(rateLimit)
      }
      const http = axios.create()
      try {
        await http.post(url, params, { headers: HEADERS })
      } catch (e) {
        console.log('Error sending to Discord', e)
      }
      DiscordSender.lastSentMessageTs = Date.now()
    }
  }
}
