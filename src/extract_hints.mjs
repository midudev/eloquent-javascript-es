import {readdirSync, readFileSync} from "fs"

process.stdout.write("# Pistas para los Ejercicios\n\nLas pistas a continuación pueden ayudarte cuando te encuentres atascado con uno de los ejercicios de este libro. No revelan la solución completa, sino que intentan ayudarte a encontrarla tú mismo.\n\n");

for (let name of readdirSync(".")) {
  if (!/^\d\d.*\.md$/.test(name)) continue

  let file = readFileSync(name, "utf8")
  let title = file.match(/(?:\n|^)# (.*?)\n/)[1], titleWritten = false

  let curSubsection
  let re = /\n### (.*?)\n|\{\{hint\n([^]+?)\nhint\}\}/g, m
  while (m = re.exec(file)) {
    if (m[1]) {
      curSubsection = m[1]
    } else {
      if (!titleWritten) {
        process.stdout.write(`## ${title}\n\n`)
        titleWritten = true
      }
      process.stdout.write(`### ${curSubsection}\n\n${m[2].trim()}\n\n`)
    }
  }
}
