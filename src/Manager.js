import jump from 'jump.js'
import { debounce } from './utils/func'
import { getBestAnchorGivenScrollLocation, getScrollTop } from './utils/scroll'
import { getHash, updateHash, removeHash } from './utils/hash'

const defaultConfig = {
  offsetShift: 0, //ardas
  handleScrollTimeout: 100, //ardas
  offset: 0,
  scrollDuration: 400,
  keepLastAnchorHash: false,
}

class Manager {
  constructor() {
    this.anchors = {}
    this.forcedHash = false
    this.config = defaultConfig
    //ardas
    this.startHashChange = true
    //

    this.scrollHandler = debounce(this.handleScroll, this.getScrollTimeout)
    this.forceHashUpdate = debounce(this.handleHashChange, 1)
  }

  addListeners = () => {
    window.addEventListener('scroll', this.scrollHandler, false)
    window.addEventListener('hashchange', this.handleHashChange)
  }

  getScrollTimeout = () => this.config.handleScrollTimeout;

  removeListeners = () => {
    window.removeEventListener('scroll', this.scrollHandler, false)
    window.removeEventListener('hashchange', this.handleHashChange)
  }

  configure = (config) => {
    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  goToTop = () => {
    if (getScrollTop() === 0) return
    this.forcedHash = true
    window.scroll(0,0)
  }

  addAnchor = (id, component) => {
    // if this is the first anchor, set up listeners
    if (Object.keys(this.anchors).length === 0) {
      this.addListeners()
    }
    this.forceHashUpdate()
    this.anchors[id] = component
  }

  removeAnchor = (id) => {
    delete this.anchors[id]
    // if this is the last anchor, remove listeners
    if (Object.keys(this.anchors).length === 0) {
      this.removeListeners()
    }
  }

  handleScroll = () => {
    //ardas
    if (this.click) {
      this.click = false
      return
    }
    //

    const {offset, offsetShift, keepLastAnchorHash} = this.config  // add offsetShift /ardas
    const bestAnchorId = getBestAnchorGivenScrollLocation(this.anchors, offset + offsetShift) // add offsetShift /ardas

    if (bestAnchorId && getHash() !== bestAnchorId) {
      this.forcedHash = true
      updateHash(bestAnchorId, false)
    } else if (!bestAnchorId && !keepLastAnchorHash) {
      removeHash()
    }
  }

  handleHashChange = (e) => {
    if (this.forcedHash) {
      this.forcedHash = false
    } else {
      this.goToSection(getHash())
    }
  }

  goToSection = (id) => {
    //ardas
    if (this.startHashChange) {
      this.startHashChange = false
    } else {
      this.click = true
    }
    //
    let element = this.anchors[id]
    if (element) {
      jump(element, {
        duration: this.config.scrollDuration,
        offset: this.config.offset,
      })
    } else {
      // make sure that standard hash anchors don't break.
      // simply jump to them.
      element = document.getElementById(id)
      if (element) {
        jump(element, {
          duration: 0,
          offset: this.config.offset,
        })
      }
    }
  }
}

export default new Manager()
