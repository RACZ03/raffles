export const environment = {
  production: true,
  APIUrl: 'http://ndiazproduction-env.eba-vwdsag7x.us-east-2.elasticbeanstalk.com',
  dtOptions: {
    pagingType: "simple_numbers",
      pageLength: 5,
      scrollX: true,
      autoWidth: false,
      destroy: true,
      responsive: true,
      dom: 'rtip',
      searching: true,
      search: false,
      info: false,
      language: {
        paginate: {
          first: "Primero",
          last: "Último",
          previous: "<",
          next: ">",
        }
      }
  }
};
