export const numberOfLogo = 11;

export const config = {
  type: 'doughnut',
  data: {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
        hoverOffset: 4
      }
    ]
  }
};
export const options = {
  responsive: true,
  maintainAspectRatio: false
};

export const req1 = {
  clk_btn1: 16,
  clk_btn2: 45,
  visitePage1: 80,
  date_debut: '2023-08-09',
  date_fin: '2023-08-10',
  graph: 'nuage de points'
};

export const req2 = {
  fromPages: ['page1', 'page2', 'page3'],
  toPage: 'page4',
  date_debut: '2023-08-09',
  date_fin: '2023-08-10',
  graph: 'camembert'
};

export const req3 = {
  visitePage1: 50,
  visitePage2: 78,
  visitePage3: 60,
  visitePage4: 3,
  date_debut: '2023-08-09',
  date_fin: '2023-08-10',
  graph: 'nuage de points'
};
