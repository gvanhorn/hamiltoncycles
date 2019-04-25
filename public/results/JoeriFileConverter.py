import json

inputFile = 'vandegriend-32.json'
outputFile = 'vandegriend-32-prepped.json'


def getGraphAverageDegree(id, graphs):
	for graph in graphs:
		if(graph['identifier'] == graphID):
			return (len(graph['edges'])*2)/graph['size']
	return -1

with open(inputFile, 'r') as input, open(outputFile, 'w') as output:
    newformatresults = []
    oldformatresults = json.load(input)
    for oldresult in oldformatresults:
        newformat = {}
        graphID = oldresult['id']
        newformat['graphID'] = graphID
        newformat['averageDegree'] = oldresult['degree']
        newformat['hamiltonian'] = oldresult['hamiltonian']
        newformat['iterations'] = oldresult['iterations']
        newformat['relativeCost'] = oldresult['iterations']/32
        newformat['milliseconds'] = int(oldresult['nanoseconds']/1000000)
        newformat['path'] = oldresult['path']
        newformat['algorithm'] = oldresult['algorithm']
        print(newformat)
        newformatresults.append(newformat)
    json.dump(newformatresults, output)