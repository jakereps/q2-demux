export default function addBoxplotsToD3(d3) {
  /* eslint-disable no-shadow */
  d3.boxplot = () => {  // eslint-disable-line no-param-reassign
    let width = 1;
    let height = 1;
    const duration = 750;
    let domain = null;

    function box(gs) {
      gs.each(function draw(data) {
        const stats = data[1];
        const g = d3.select(this);

        const quartiles = [stats['25%'], stats['50%'], stats['75%']];
        const whiskers = [stats.min, stats.max];

        const x1 = d3.scaleLinear()
          .domain(domain.call(this))
          .range([height, 0]);

        const x0 = this.existingChart || d3.scaleLinear()
          .domain([0, Infinity])
          .range(x1.range());

        this.existingChart = x1;

        const whiskerLine = g.selectAll('line.center')
          .data([whiskers]);
        whiskerLine.enter().append('line', 'rect')
          .attr('class', 'center')
          .attr('x1', 0)
          .attr('y1', d => x0(d[0]))
          .attr('x2', 0)
          .attr('y2', d => x0(d[1]))
          .style('opacity', 1e-6)
          .attr('stroke-dasharray', '3,3')
          .attr('stroke', 'black')
          .attr('stroke-width', '1px')
        .transition()
          .duration(duration)
          .style('opacity', 1)
          .attr('y1', d => x1(d[0]))
          .attr('y2', d => x1(d[1]));

        whiskerLine.transition()
          .duration(duration)
          .style('opacity', 1)
          .attr('x1', 0)
          .attr('x2', 0)
          .attr('y1', d => x1(d[0]))
          .attr('y2', d => x1(d[1]));

        const iqBox = g.selectAll('rect.box')
          .data([quartiles]);

        iqBox.enter().append('rect')
          .attr('class', 'box')
          .attr('x', -width / 2)
          .attr('y', d => x0(d[2]))
          .attr('width', width)
          .attr('height', d => x0(d[0]) - x0(d[2]))
          .attr('fill', 'steelblue')
          .attr('stroke', 'black')
          .attr('stroke-width', '1px')
          .on('mouseover', function mouseover() {
            d3.select(this)
              .attr('fill', 'skyblue');
          })
          .on('mouseout', function mouseout() {
            d3.select(this)
              .attr('fill', 'steelblue');
          })
        .transition()
          .duration(duration)
          .attr('y', d => x1(d[2]))
          .attr('height', d => x1(d[0]) - x1(d[2]));

        iqBox.transition()
          .duration(duration)
          .attr('x', -width / 2)
          .attr('y', d => x1(d[2]))
          .attr('width', width)
          .attr('height', d => x1(d[0]) - x1(d[2]));

        const medianLine = g.selectAll('line.median')
          .data([quartiles[1]]);

        medianLine.enter().append('line')
          .attr('class', 'median')
          .attr('x1', -width / 2)
          .attr('y1', x0)
          .attr('x2', width / 2)
          .attr('y2', x0)
          .attr('stroke', 'black')
          .attr('stroke-width', '1px')
        .transition()
          .duration(duration)
          .attr('y1', x1)
          .attr('y2', x1);

        medianLine.transition()
          .duration(duration)
          .attr('x1', -width / 2)
          .attr('x2', width / 2)
          .attr('y1', x1)
          .attr('y2', x1);

        const whisker = g.selectAll('line.whisker')
          .data(whiskers);

        whisker.enter().insert('line', 'circle, text')
          .attr('class', 'whisker')
          .attr('x1', -width / 2)
          .attr('y1', x0)
          .attr('x2', width / 2)
          .attr('y2', x0)
          .style('opacity', 1e-6)
          .attr('stroke', 'black')
          .attr('stroke-width', '1px')
        .transition()
          .duration(duration)
          .attr('y1', x1)
          .attr('y2', x1)
          .style('opacity', 1);

        whisker.transition()
          .duration(duration)
          .attr('x1', -width / 2)
          .attr('x2', width / 2)
          .attr('y1', x1)
          .attr('y2', x1)
          .style('opacity', 1);

        d3.select(this).on('mouseover', function mouseover() {
          const svg = d3.select(this.parentNode).node();
          const plotContainer = d3.select(svg.parentNode);
          plotContainer
          .select('.stats')
          .select('tbody')
          .selectAll('tr')
            .data([
              ['Position Number', data[0]],
              ['Minimum', whiskers[0]],
              ['1st Quartile', quartiles[0]],
              ['Median', quartiles[1]],
              ['3rd Quartile', quartiles[2]],
              ['Maximum', whiskers[1]],
            ])
          .selectAll('td')
            .data(d => d)
            .text(d => d);
        });
      });
    }

    box.width = (x) => {
      if (!arguments.length) return width;
      width = x;
      return box;
    };

    box.height = (x) => {
      if (!arguments.length) return height;
      height = x;
      return box;
    };

    const functor = x => () => x;

    box.domain = (x) => {
      if (!arguments.length) return domain;
      domain = x == null ? x : functor(x);
      return box;
    };

    return box;
  };
  /* eslint-enable no-shadow */
}
