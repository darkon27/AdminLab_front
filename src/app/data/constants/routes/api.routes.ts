import { environment as ENV } from "../../../../environments/environment";

export const VERSION_APLICATIVO = "v.1.1.6 ";

export const API_ROUTESE = {
    precisa: `${document.domain.includes('adminlab')==true?'https://precisa.pe':`http://${document.domain}`}`,
    //precisa: 'https://adminlab.acml-app.pe/#/',
    //precisa: 'http://35.211.70.242:8087', 
    //precisa: 'http://35.211.112.42', 
    //precisa: 'http://localhost',
    //precisa: 'http://35.211.4.135:8087', 
    soa: 'https://precisa.pe'
};

