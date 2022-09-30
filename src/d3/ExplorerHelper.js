import * as d3 from "d3";

function getWidth () {
  return document.getElementById("graph-explorer").getBoundingClientRect().width;
}

function getHeight () {
  return document.getElementById("graph-explorer").getBoundingClientRect().height;
}

var explorerSVG, force;

export const explorerCanvasSetup = function graphCanvasSetup () {
  explorerSVG = d3.select("#graph-explorer").append("svg")
    .attr("width", getWidth())
    .attr("height", getHeight())
    .append("g");
  // .attr("transform", "translate(" + graphMargin.left + "," + graphMargin.top + ")");
};

export const drawForceDirectedGraph = function drawForceDirectedGraph (graph) {
  //Evaluate the connectivity map as JSON
  let degreeMap = graph["connectivityMap"];

  //Initialize all the nodes
  let nodes = [];
  for (let i = 0; i < graph.vertices.length; i++) {
    nodes.push({x: getWidth() / (i + 1), y: getHeight() / (i + 1), degree: degreeMap[i], id: i});
  }

  //Initialize all edges
  let edges = graph.edges;
  let links = [];
  for (let i = 0; i < edges.length; i++) {
    let source = parseInt(edges[i].endpoints[0].id);
    let target = parseInt(edges[i].endpoints[1].id);
    let id = 'link' + source + "-" + target;
    links.push({source: source, target: target, id: id});
  }

  //Define a color scale based on degree of a node
  let nodecolor = d3.scaleLinear()
    .domain([0, graph.vertices.length - 1])
    .range(["white", "#b30000"]);

  //Define and start the force layout
  force = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("link", d3.forceLink(links).distance(getWidth() / graph.vertices.length).id(d => d.id))
    .force('center', d3.forceCenter(getWidth() / 2, getHeight() / 2))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .alphaTarget(1);

  //Enter all links
  let linkage = explorerSVG.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('id', function (d) {
      return d.id;
    })
    .attr('class', 'link')
    .attr('stroke', 'gray');

  //Enter all the nodes
  let nodeElements = explorerSVG.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node");

  //Add drag functionality
  nodeElements.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  //Append circles to the nodes
  nodeElements.append("circle")
    .attr('class', 'nodeCircle')
    .attr('r', 10)
    .style("fill", function (d) {
      return nodecolor(d["degree"]);
    })
    .on('dblclick', dblclick);

  //Append labels to the nodes
  nodeElements.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".4em")
    .attr("class", "nodeLabel")
    .style("pointer-events", "none")
    .text(function (d) {
      return d.degree
    });

  //Define animation of the layout.
  force.on('tick', function () {
    linkage.attr('x1', function (d) {
      return d.source.x;
    })
      .attr('y1', function (d) {
        return d.source.y;
      })
      .attr('x2', function (d) {
        return d.target.x;
      })
      .attr('y2', function (d) {
        return d.target.y;
      });
    nodeElements.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });
};

export const labelNodes = function labelNodes (labelType) {
  d3.selectAll(".nodeLabel").text(function (d) {
    return labelType === 'id' ? d.id : d.degree
  })
}

export const colorHamiltonCycle = function colorHamiltonCycle (result) {
  for (let i = 0; i < result['graphSize']; i++) {
    //last node in path, loop back to first
    let source, target;
    if (i === result['graphSize'] - 1) {
      source = result['path'][i].id;
      target = result['path'][0].id;
    } else {
      source = result['path'][i].id;
      target = result['path'][i + 1].id;
    }
    let selector = "#link" + source + '-' + target;
    let invertedSelector = "#link" + target + '-' + source;
    d3.selectAll(selector)
      .attr('stroke', 'green')
      .attr('stroke-width', '3');
    d3.selectAll(invertedSelector)
      .attr('stroke', 'green')
      .attr('stroke-width', '3');
  }
};

export const removeHamiltonCycle = function removeHamiltonCycle () {
  d3.selectAll(".link").attr('stroke', 'grey').attr('stroke-width', '1');
};

function dblclick (event, d) {
  if (!event.active) {
    d.fx = d.fy = null;
  }
}

function dragstarted (event, d) {
  if (event) {
    force.alphaTarget(0.3).restart();
  }
  d.fx = d.x;
  d.fy = d.y;
}

function dragged (event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended (event, d) {
  if (!event) {
    force.alphaTarget(0);
  }
}

