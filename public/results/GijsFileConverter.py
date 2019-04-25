import json

inputFile = 'vacul-24.json'
outputFile = 'vacul-24-prepped.json'

graphsFile = 'indexed-24-node-test-set.json'


def getGraphAverageDegree(id, graphs):
	for graph in graphs:
		if(graph['identifier'] == graphID):
			return (len(graph['edges'])*2)/graph['size']
	return -1

with open(inputFile, 'r') as input, open(graphsFile, 'r') as graphs, open(outputFile, 'w') as output:
    oldformatresults = json.load(input)
    graphs = json.load(graphs)

    newformatresults = []
    for oldresult in oldformatresults:
    	graphID = oldresult['graphID']
    	averageDegree = getGraphAverageDegree(graphID, graphs)
    	if averageDegree < 0:
    		print(graphID)
    	oldresult['averageDegree'] = averageDegree
    	newformatresults.append(oldresult)
    json.dump(newformatresults, output)