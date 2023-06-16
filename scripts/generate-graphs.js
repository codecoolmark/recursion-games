const fs = require('node:fs/promises');

const familyTree = require("../habsburgs.json");

function generateId(person) {
    return `${person.name.replace(/[\s\./]*/g, "")}${person.yearOfBirth}${person.yearOfDeath}`
}

function graphVizNodes(parent) {
    const parentId = generateId(parent)
    let code = `    ${parentId} [label="${parent.name}"];\n`
    code += parent.children?.map(child => `${graphVizNodes(child)}\n\t${parentId} -> ${generateId(child)};`).join(`\n`) ?? ``
    return code
}

const graphVizCode = `digraph "${familyTree.name}" {
    node[shape=box];
    bgcolor="transparent";
${graphVizNodes(familyTree.tree)}
}`;

fs.writeFile("habsburgs.gv", graphVizCode).catch(error => console.log(error))

