var ws = new WebSocket("ws://localhost:8000/sendVote");
pollingChart;

function setUpChart(dataVotes) {
var ctx_live = document.getElementById("mycanvas");
         var myChart = new Chart(ctx_live, {
         type: 'pie',
           data: {
             labels: ['Dogs', 'Cats'],
             datasets: [{
               label: 'Dogs Vs Cats',
               data: dataVotes,
               fill: false,
               backgroundColor: ['#bceefe','#ffa9f3'],
               borderColor: '#000',
               borderWidth: 1
             }]
           },
           options: {
             plugins: {
               labels: {
                 render: 'image',
                 textMargin: -130,
                 images: [
                   {
                     src: 'https://img.freepik.com/free-vector/cute-pug-dog-floating-with-balloon-cartoon-vector-icon-illustration-animal-nature-flat-cartoon_138676-4287.jpg?w=1060&t=st=1659718952~exp=1659719552~hmac=ff5546154a80708c6f4c66f3aa5a55c69d221dfd1c9321bd34e2cbe24d1d4ad0',
                     width: 120,
                     height: 120
                   },
                   {
                     src: 'https://img.freepik.com/free-vector/cute-cat-with-love-sign-hand-cartoon-illustration-animal-nature-concept-isolated-flat-cartoon-style_138676-3419.jpg?w=1060&t=st=1659718977~exp=1659719577~hmac=1fefa0416dbe1d20d345f9dabd0289ee0c2144d20d5aadd5ffa3199b16d2cd77',
                     width: 120,
                     height: 120
                   }
                 ]
               }
             },
             scales: {
               yAxes: [{
                 ticks: {
                   beginAtZero: true,
                   display: false
                 },
                 gridLines: {
                     display: false
                 }
               }]
             }
           }
         });

pollingChart = myChart;
}

function myVote(voteTo) {
    var vote = voteTo === 'dogs' ? 0 : 1;
    pollingChart.data.datasets[0].data[vote] += 1;
    pollingChart.update();
    console.log(pollingChart.data.datasets[0].data)
    sendMessage(voteTo);
}


function sendMessage(votedTo) {
    ws.send(votedTo);
    event.preventDefault();
}