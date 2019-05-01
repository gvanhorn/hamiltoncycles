import json

inputFile = 'vandegriend-32.json'
outputFile = 'vandegriend-32-prepped.json'

algorithms = ['cheeseman', 'martello', 'nakeddepthfirst', 'rubin', 'vandegriend', 'vanhorn']
graphsizes = [16, 24, 32]


def prepResults(algorithm, graphSize):
    inputFile = 'results/result-' + algorithm + '-' + str(graphSize) + '.json'
    outputFile = '../prepared-results/' + algorithm + "-" + str(graphSize) + '.json'

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
            newformat['relativeCost'] = oldresult['iterations'] / 32
            newformat['milliseconds'] = int(oldresult['nanoseconds'] / 1000000)
            newformat['path'] = oldresult['path']
            newformat['algorithm'] = oldresult['algorithm']
            newformatresults.append(newformat)
        json.dump(newformatresults, output)


for algorithm in algorithms:
    for graphsize in graphsizes:
        prepResults(algorithm, graphsize)
        print("prepped " + algorithm + " on graphsize " + str(graphsize))
