import json

inputFile = 'indexed-24-node-test-set.json'
outputFolder = 'indexed-24-node-test-set'

with open(inputFile, 'r') as input:
    graphs = json.load(input)

    for graph in graphs:
        outputFile = outputFolder + "/" + str(graph['identifier']) + ".json"
        with open(outputFile, 'w') as output:
            json.dump(graph, output)
