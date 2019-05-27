import json
from statistics import mean, median

algorithms = ['cetal', 'martello', 'nakeddepthfirst', 'rubin', 'vacul', 'vanhorn']
graphsizes = [16, 24, 32]


def process(algorithm, graphSize):
    inputFile = "prepared-results/" + algorithm + '-' + str(graphSize) + '.json'
    derivedOutputFile = "prepared-results/" + algorithm + '-' + str(graphSize) + '-derived.json'

    with open(inputFile, 'r') as input:
        data = []
        for line in input:
            result = json.loads(line)
            data.append(result)

        buckets = {}
        derived = []
        for result in data:
            if result['averageDegree'] in buckets.keys():
                buckets[result['averageDegree']].append(result['relativeCost'])
            else:
                buckets[result['averageDegree']] = [result['relativeCost']]

        for averageDegree in buckets.keys():
            derived.append({'algorithm': algorithm, 'graphSize': graphSize, 'averageDegree': averageDegree,
                            'mean': mean(buckets[averageDegree]), 'median': median(buckets[averageDegree])})

        with open(derivedOutputFile, 'w') as derivedOutput:
            for datum in derived:
                derivedOutput.write(json.dumps(datum) + "\n")


# process('cetal', 16)

for algorithm in algorithms:
    for graphsize in graphsizes:
        process(algorithm, graphsize)
        print("prepped " + algorithm + " on graphsize " + str(graphsize))
