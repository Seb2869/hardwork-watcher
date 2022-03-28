import { Listener } from './listener'

try {
  Listener.start()
} catch (e) {
  console.error(e)
  process.exit(1)
}
