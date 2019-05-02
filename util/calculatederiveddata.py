import json
from statistics import mean, median

algorithms = ['cetal', 'martello', 'nakeddepthfirst', 'rubin', 'vacul', 'vanhorn']
graphsizes = [16, 24, 32]


def process(algorithm, graphSize):
    inputFile = algorithm + '-' + str(graphSize) + '.json'
    meanOutputFile = algorithm + '-' + str(graphSize) + '-mean.json'
    medianOutputFile = algorithm + '-' + str(graphSize) + '-median.json'

    with open(inputFile, 'r') as input:
        data = json.load(input)
        buckets = {}
        means = {}
        medians = {}
        for result in data:
            if result['averageDegree'] in buckets.keys():
                buckets[result['averageDegree']].append(result['relativeCost'])
            else:
                buckets[result['averageDegree']] = [result['relativeCost']]

        for averageDegree in buckets.keys():
            means[averageDegree] = mean(buckets[averageDegree])
            medians[averageDegree] = median(buckets[averageDegree])

        with open(meanOutputFile, 'w') as meanOutput, open(medianOutputFile, 'w') as medianOutput:
            json.dump(means, meanOutput)
            json.dump(medians, medianOutput)


for algorithm in algorithms:
    for graphsize in graphsizes:
        process(algorithm, graphsize)
        print("prepped " + algorithm + " on graphsize " + str(graphsize))
