import pify from 'pify'
import less from 'less'
import humanlizePath from './utils/humanlize-path'

export default {
  name: 'less',
  test: /\.less$/,
  async process({ code }) {
    let { css, map, imports } = await pify(less.render.bind(less))(code, {
      ...this.options,
      sourceMap: this.sourceMap && {},
      filename: this.id
    })

    for (const dep of imports) {
      this.dependencies.add(dep)
    }

    if (map) {
      map = JSON.parse(map)
      map.sources = map.sources.map(source => humanlizePath(source))
    }

    return {
      code: css,
      map
    }
  }
}
