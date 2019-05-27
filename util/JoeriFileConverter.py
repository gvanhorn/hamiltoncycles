import json

inputFile = 'vandegriend-32.json'
outputFile = 'vandegriend-32-prepped.json'

algorithms = ['cetal', 'martello', 'nakeddepthfirst', 'rubin', 'vacul', 'vanhorn']
graphsizes = [16, 24, 32]


def prepResults(algorithm, graphSize):
    inputFile = 'results/result-' + algorithm + '-' + str(graphSize) + '.json'
    outputFile = 'prepared-results/' + algorithm + "-" + str(graphSize) + '.json'

    with open(inputFile, 'r') as input, open(outputFile, 'w') as output:
        oldformatresults = json.load(input)
        for oldresult in oldformatresults:
            result = {}
            graphID = oldresult['id']
            result['graphID'] = graphID
            result['averageDegree'] = oldresult['degree']
            result['hamiltonian'] = oldresult['hamiltonian']
            result['iterations'] = oldresult['iterations']
            result['relativeCost'] = oldresult['iterations'] / 32
            result['nanoseconds'] = oldresult['nanoseconds']
            result['path'] = oldresult['path']
            result['algorithm'] = algorithm
            result['graphSize'] = graphSize
            jsonString = json.dumps(result)
            output.write(jsonString + "\n")


for algorithm in algorithms:
    for graphsize in graphsizes:
        prepResults(algorithm, graphsize)
        print("prepped " + algorithm + " on graphsize " + str(graphsize))
