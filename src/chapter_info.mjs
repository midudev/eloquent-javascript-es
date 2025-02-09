// Fragile, hacky script that finds exercises in chapters, extracts
// their starting code, and collects it into a big JSON object
// together with the solution code.

import * as PJSON from './pseudo_json.mjs'
import * as fs from 'fs'
import * as path from 'path'
import jszip from 'jszip'

const TRANSLATIONS_MAP = {
  '02_1_haciendo_un_tringulo_con_bucles.js': '02_1_looping_a_triangle.js',
  '02_3_tablero_de_ajedrez.js': '02_3_chessboard.js',
  '03_1_mnimo.js': '03_1_minimum.js',
  '03_2_recursin.js': '03_2_recursion.js',
  '03_3_contando_minuciosamente.js': '03_3_bean_counting.js',
  '04_1_la_suma_de_un_rango.js': '04_1_the_sum_of_a_range.js',
  '04_2_reversin_de_un_array.js': '04_2_reversing_an_array.js',
  '04_3_lista.js': '04_3_a_list.js',
  '04_4_comparacin_profunda.js': '04_4_deep_comparison.js',
  '05_1_aplanamiento.js': '05_1_flattening.js',
  '05_2_tu_propio_bucle.js': '05_2_your_own_loop.js',
  '05_4_direccin_de_escritura_dominante.js': '05_4_dominant_writing_direction.js',
  '06_1_un_tipo_de_vector.js': '06_1_a_vector_type.js',
  '06_2_grupos.js': '06_2_groups.js',
  '06_3_grupos_iterables.js': '06_3_iterable_groups.js',
  '07_1_medicin_de_un_robot.js': '07_1_measuring_a_robot.js',
  '07_2_eficiencia_del_robot.js': '07_2_robot_efficiency.js',
  '07_3_grupo_persistente.js': '07_3_persistent_group.js',
  '08_1_reintentar.js': '08_1_retry.js',
  '08_2_la_caja_cerrada_con_llave.js': '08_2_the_locked_box.js',
  '09_2_estilo_de_comillas.js': '09_2_quoting_style.js',
  '09_3_nmeros_nuevamente.js': '09_3_numbers_again.js',
  '10_2_mdulo_de_caminos.js': '10_2_roads_module.js',
  '11_1_momentos_de_tranquilidad.js': '11_1_quiet_times.js',
  '11_2_promesas_reales.js': '11_2_real_promises.js',
  '11_3_construyendo_promiseall.js': '11_3_building_promiseall.js',
  '12_3_comentarios.js': '12_3_comments.js',
  '12_4_corrigiendo_el_mbito.js': '12_4_fixing_scope.js',
  '14_1_construir_una_tabla.html': '14_1_build_a_table.html',
  '14_2_elementos_por_nombre_de_etiqueta.html': '14_2_elements_by_tag_name.html',
  '14_3_el_sombrero_del_gato.html': '14_3_the_cats_hat.html',
  '15_1_globo.html': '15_1_balloon.html',
  '15_2_estela_del_ratn.html': '15_2_mouse_trail.html',
  '15_3_pestaas.html': '15_3_tabs.html',
  '16_1_juego_terminado.html': '16_1_game_over.html',
  '16_2_pausar_el_juego.html': '16_2_pausing_the_game.html',
  '16_3_un_monstruo.html': '16_3_a_monster.html',
  '17_1_formas.html': '17_1_shapes.html',
  '17_2_el_grfico_circular.html': '17_2_the_pie_chart.html',
  '17_3_una_pelota_rebotando.html': '17_3_a_bouncing_ball.html',
  '18_1_negociacin_de_contenido.js': '18_1_content_negotiation.js',
  '18_2_un_banco_de_trabajo_de_javascript.html': '18_2_a_javascript_workbench.html',
  '18_3_juego_de_la_vida_de_conway.html': '18_3_conways_game_of_life.html',
  '19_1_atajos_de_teclado.html': '19_1_keyboard_bindings.html',
  '19_2_dibujando_eficientemente.html': '19_2_efficient_drawing.html',
  '19_3_crculos.html': '19_3_circles.html',
  '19_4_lneas_adecuadas.html': '19_4_proper_lines.html'
}

const output = []; let failed = false

for (const file of fs.readdirSync('.').sort()) {
  let match = /^((\d+).*).md$/.exec(file)
  const chapNum = match && match[2]

  if (!match || chapNum === '22') continue
  const text = fs.readFileSync(file, 'utf8')

  const meta = (/{{meta (.*)}}/.exec(text) || { 1: '{}' })[1]
  let includes = /\bload_files: (\[.*?\])/.exec(meta)
  if (includes) includes = JSON.parse(includes[1])

  const chapter = {
    number: +chapNum,
    id: match[1],
    title: text.match(/(?:^|\n)# (.*?)\n/)[1],
    start_code: getStartCode(text, includes),
    exercises: [],
    include: includes
  }

  const zip = chapterZipFile(meta, chapter)
  let extraLinks = meta.match(/\bcode_links: (\[.*?\])/)
  console.log({ chapter, extraLinks })
  if (extraLinks) extraLinks = JSON.parse(extraLinks[1])
  if (extraLinks || zip) { chapter.links = (zip ? [zip] : []).concat(extraLinks || []) }

  function addSolution (name, file, type, num, startCode) {
    let solution, extra
    const realFile = TRANSLATIONS_MAP[file] ?? file
    try {
      solution = fs.readFileSync('code/solutions/' + realFile, 'utf8')
      extra = /^\s*<!doctype html>\s*(<base .*\n(<script src=.*\n)*)?/.exec(solution)
      if (extra) solution = solution.slice(extra[0].length)
    } catch (e) {
      console.error('File ', realFile, ' does not exist.', e)
      failed = true
    }

    chapter.exercises.push({
      name,
      file: 'code/solutions/' + realFile,
      number: num,
      type,
      code: type === 'html' ? prepareHTML(startCode, includes) : startCode,
      solution: type === 'html' ? prepareHTML(solution.trim(), includes) : solution.trim()
    })
  }

  const exerciseSection = text.indexOf('\n## Ejercicios\n')
  const exerciseBlock = exerciseSection >= 0 ? text.slice(exerciseSection) : ''
  const header = /\n### (.*?)\n/g; const nextHeader = /\n##+ \w/g
  let num = 1

  while (match = header.exec(exerciseBlock)) {
    nextHeader.lastIndex = header.lastIndex
    const foundNext = nextHeader.exec(exerciseBlock)
    const nextsection = foundNext ? foundNext.index : -1

    for (let pos = header.lastIndex; ;) {
      const ifdef = exerciseBlock.indexOf('{{if interactive', pos)
      if (ifdef == -1 || nextsection > 0 && nextsection < ifdef) break
      const indef = exerciseBlock.slice(pos = ifdef + 15, exerciseBlock.indexOf('if}}', ifdef))
      const sourceBlock = indef.match(/```(.*)\n([^]+?)\n```/)
      if (!sourceBlock || sourceBlock[1].indexOf('null') > -1) continue
      const type = sourceBlock[1].indexOf('html') > -1 ? 'html' : 'js'
      const file = chapNum + '_' + num + '_' + match[1].toLowerCase().replace(/[^\-\s\w]/g, '').replace(/\s/g, '_') + '.' + type

      addSolution(match[1], file, type, num, sourceBlock[2])
    }

    ++num
  }

  const nodeInfo = '// Node exercises can not be ran in the browser,\n// but you can look at their solution here.\n'

  if (chapter.number == 6) {
    chapter.exercises.push({
      name: 'Borrowing a method [3rd ed]',
      file: 'code/solutions/06_4_borrowing_a_method.js',
      number: '4[3]',
      type: 'js',
      code: 'let map = {one: true, two: true, hasOwnProperty: true};\n\n// Fix this call\nconsole.log(map.hasOwnProperty("one"));\n// → true',
      solution: 'let map = {one: true, two: true, hasOwnProperty: true};\n\nconsole.log(Object.prototype.hasOwnProperty.call(map, "one"));\n// → true'
    })
  }
  if (chapter.number == 11) {
    chapter.exercises.push({
      name: 'Tracking the scalpel [3rd ed]',
      file: 'code/solutions/11_1_tracking_the_scalpel.js',
      number: '1[3]',
      type: 'js',
      code: 'async function locateScalpel(nest) {\n  // Your code here.\n}\n\nfunction locateScalpel2(nest) {\n  // Your code here.\n}\n\nlocateScalpel(bigOak).then(console.log);\n// → Butcher Shop',
      solution: "async function locateScalpel(nest) {\n  let current = nest.name;\n  for (;;) {\n    let next = await anyStorage(nest, current, \"scalpel\");\n    if (next == current) return current;\n    current = next;\n  }\n}\n\nfunction locateScalpel2(nest) {\n  function loop(current) {\n    return anyStorage(nest, current, \"scalpel\").then(next => {\n      if (next == current) return current;\n      else return loop(next);\n    });\n  }\n  return loop(nest.name);\n}\n\nlocateScalpel(bigOak).then(console.log);\n// → Butcher's Shop\nlocateScalpel2(bigOak).then(console.log);\n// → Butcher's Shop",
      goto: 'https://eloquentjavascript.net/3rd_edition/code/#11.1'
    })
  }
  if (chapter.number == 20) {
    chapter.exercises = [
      {
        name: 'Search tool',
        file: 'code/solutions/20_1_search_tool.mjs',
        number: 1,
        type: 'js',
        code: nodeInfo,
        solution: fs.readFileSync('code/solutions/20_1_search_tool.mjs', 'utf8')
      },
      {
        name: 'Directory creation',
        file: 'code/solutions/20_2_directory_creation.mjs',
        number: 2,
        type: 'js',
        code: nodeInfo,
        solution: fs.readFileSync('code/solutions/20_2_directory_creation.mjs', 'utf8')
      },
      {
        name: 'A public space on the web',
        file: 'code/solutions/20_3_a_public_space_on_the_web.zip',
        number: 3,
        type: 'js',
        code: nodeInfo,
        solution: '// This solutions consists of multiple files. Download it\n// though the link below.\n'
      }
    ]
  }
  if (chapter.number == 21) {
    chapter.exercises = [
      {
        name: 'Disk persistence',
        file: 'code/solutions/21_1_disk_persistence.mjs',
        number: 1,
        type: 'js',
        code: nodeInfo,
        solution: fs.readFileSync('code/solutions/21_1_disk_persistence.mjs', 'utf8')
      },
      {
        name: 'Comment field resets',
        file: 'code/solutions/21_2_comment_field_resets.mjs',
        number: 2,
        type: 'js',
        code: nodeInfo,
        solution: fs.readFileSync('code/solutions/21_2_comment_field_resets.mjs', 'utf8')
      }
    ]
  }

  output.push(chapter)
}

output.push({
  title: 'JavaScript and Performance',
  number: 22,
  start_code: '<!-- This chapter exists in the paper book, not in the online version -->\n\n<script>\n  runLayout(forceDirected_simple, gridGraph(12));\n</script>\n',
  include: ['code/draw_layout.js', 'code/chapter/22_fast.js'],
  exercises: [
    {
      name: 'Prime numbers',
      file: 'code/solutions/22_1_prime_numbers.js',
      number: 1,
      type: 'js',
      code: 'function* primes() {\n  for (let n = 2;; n++) {\n    // ...\n  }\n}\n\nfunction measurePrimes() {\n  // ...\n}\n\nmeasurePrimes();\n',
      solution: fs.readFileSync('code/solutions/22_1_prime_numbers.js', 'utf8')
    },
    {
      name: 'Faster prime numbers',
      file: 'code/solutions/22_2_faster_prime_numbers.js',
      number: 2,
      type: 'js',
      code: 'function* primes() {\n  for (let n = 2;; n++) {\n    // ...\n  }\n}\n\nfunction measurePrimes() {\n  // ...\n}\n\nmeasurePrimes();\n',
      solution: fs.readFileSync('code/solutions/22_2_faster_prime_numbers.js', 'utf8')
    },
    {
      name: 'Pathfinding [3rd ed]',
      file: 'code/solutions/22_1_pathfinding.js',
      number: '1[3]',
      type: 'js',
      code: 'function findPath(a, b) {\n  // Your code here...\n}\n\nlet graph = treeGraph(4, 4);\nlet root = graph[0], leaf = graph[graph.length - 1];\nconsole.log(findPath(root, leaf).length);\n// → 4\n\nleaf.connect(root);\nconsole.log(findPath(root, leaf).length);\n// → 2\n',
      solution: fs.readFileSync('code/solutions/22_1_pathfinding.js', 'utf8'),
      goto: 'https://eloquentjavascript.net/3rd_edition/code/#22.1'
    },
    {
      name: 'Timing [3rd ed]',
      file: 'code/solutions/22_2_timing.js',
      number: '2[3]',
      type: 'js',
      code: '',
      solution: fs.readFileSync('code/solutions/22_2_timing.js', 'utf8'),
      goto: 'https://eloquentjavascript.net/3rd_edition/code/#22.2'
    },
    {
      name: 'Optimizing [3rd ed]',
      file: 'code/solutions/22_3_optimizing.js',
      number: '3[3]',
      type: 'js',
      code: '',
      solution: fs.readFileSync('code/solutions/22_3_optimizing.js', 'utf8'),
      goto: 'https://eloquentjavascript.net/3rd_edition/code/#22.3'
    }
  ]
})

const usedSolutions = new Set()
for (const ch of output) for (const ex of ch.exercises) usedSolutions.add(path.basename(ex.file).replace(/\..*/, ''))

for (const file of fs.readdirSync('code/solutions/')) {
  if (!usedSolutions.has(file.replace(/\..*/, ''))) {
    console.error('Solution file ' + file + ' was not used.')
    failed = true
  }
}

if (!failed) { console.log('var chapterData = ' + JSON.stringify(output, null, 2) + ';') } else { process.exit(1) }

function prepareHTML (code, include) {
  return '<!doctype html>\n' + (include || []).map(s => '<script src="' + s + '"></script>\n').join('') + '\n' + code
}

function guessType (code) {
  return /^[\s\w\n:]*</.test(code) ? 'html' : 'js'
}

function getStartCode (text, includes) {
  const found = /\n```(.*?\bstartCode:.*)\n([^]*?\n)```/.exec(text)
  if (!found) return ''

  let snippet = found[2].replace(/(\n|^)\s*\/\/ →.*\n/g, '$1')
  const directive = String(PJSON.parse(found[1]).startCode); let m
  if (m = directive.match(/top_lines:\s*(\d+)/)) { snippet = snippet.split('\n').slice(0, Number(m[1])).join('\n') + '\n' }
  if (m = directive.match(/bottom_lines:\s*(\d+)/)) {
    const lines = snippet.trimRight().split('\n')
    snippet = lines.slice(lines.length - Number(m[1])).join('\n') + '\n'
  }
  if (guessType(snippet) == 'html') { return prepareHTML(snippet, includes) } else { return snippet }
}

function chapterZipFile (meta, chapter) {
  const spec = meta.includes('zip: "html include=')
  if (!spec) return null
  if (!chapter.start_code) throw new Error('zip but no start code')

  const data = meta.match(/include=\[(.*?)\]/)
  const name = 'code/chapter/' + chapter.id + '.zip'

  console.log(meta)
  const includeMatch = meta.match(/include=\[(.*?)\]/)
  const metaInclude = JSON.parse(`[${includeMatch[1]}]`)

  const files = (chapter.include || []).concat(metaInclude).filter(f => !/(^|\/)_/.test(f))
  const exists = fs.existsSync(name) && fs.statSync(name).mtime
  if (exists && files.every(file => fs.statSync('html/' + file).mtime < exists)) { return name }

  const zip = new jszip()
  for (const file of files) {
    zip.file(chapter.id + '/' + file, fs.readFileSync('html/' + file))
  }

  if (data[1].indexOf('html') != -1) {
    let html = chapter.start_code
    if (guessType(html) != 'html') { html = prepareHTML('<body><script>\n' + html.trim() + '\n</script></body>', chapter.include) }
    zip.file(chapter.id + '/index.html', html)
  }
  if (data[1].indexOf('node') != -1) {
    zip.file(chapter.id + '/code/load.js', fs.readFileSync('code/load.js', 'utf8'))
    let js = chapter.start_code
    if (chapter.include) js = '// load dependencies\nrequire("./code/load")(' + chapter.include.map(JSON.stringify).join(', ') + ');\n\n' + js
    zip.file(chapter.id + '/run_with_node.js', js)
  }
  zip.generateAsync({ type: 'uint8array' }).then(content => fs.writeFileSync(name, content))
  return name
}
