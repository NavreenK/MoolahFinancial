import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { PortfolioProvider } from '../../providers/portfolio/portfolio.service';
import { UserProvider } from '../../providers/user/user.service';
import { TabsPage } from '../tabs/tabs';
import { Portfolio, PortfolioData, BestPortfolioInfo, ApiData } from '../../providers/models';

@Component({
  selector: 'page-home',
  templateUrl: 'invest.html'
})
export class InvestPage {

  portfolio: any;
  recommendedPortfolio: Portfolio;

  //public technologies : Array<any>;
  constructor(public navCtrl: NavController, public portfolioProvider: PortfolioProvider, public userProvider: UserProvider) {
    this.getBestPortfolioInfo();
    // this.getPortfolios();
  }

  getPortfolios() {
    this.portfolioProvider.getPortfolios()
    .then(data => {
      this.portfolio = data;
      console.log(this.portfolio);
    });
  }

  chooseInvestment() {
    // Mark that the user has successfully filled out the questionnaire
    this.userProvider.updateHasFilledOutQuestionnaire().subscribe((data: ApiData) => {
      if(data.success) {
        // Update the local object representing the user as well
        this.userProvider.currentUser.has_completed_questionnaire = true;
        console.log("User has successfully filled out the questionnaire!", this.userProvider);
      }
    });

    this.navCtrl.push(TabsPage);
  }

  // Calls the api to retrieve a dummy recommended portfolio
  getDummyBestPortfolio() {
    this.portfolioProvider.getDummyBestPortfolio(this.userProvider.currentUser.user_id).subscribe((data: PortfolioData) => {
      if(data.success) {
        this.recommendedPortfolio = <Portfolio>data.portfolio;
      }
    });
  }

  // Sets the portfolio to be recommended for a given user (based on the tags set by the questionaire)
  getBestPortfolioInfo() {
    // Retrieve the portfolio id for the recommended portfolio
    this.portfolioProvider.getBestPortfolioInfo(this.userProvider.currentUser.user_id).subscribe((data: BestPortfolioInfo) => {
      // console.log("Data from getBestPortfolioInfo: ", data);
      // console.log(data.result[0]);
      // console.log(data.result[0].portfolio_id);

      // Retrieve the recommended portfolio
      var bestPortfolioId = data.result[0].portfolio_id;
      
      if(data.success && bestPortfolioId != null)
      {
        console.log("Real Portfolio is getting recommended");
        // Retrieve the recommended portfolio based on the retrieved id
        this.portfolioProvider.getPortfolioById(bestPortfolioId).subscribe((portfolio: Portfolio) => {
          this.recommendedPortfolio = portfolio;
        });
      } 
      // If the user has no tags to make recommendations off of, or if something goes wrong, give a dummy portfolio as a recommendation
      else 
      {
        console.log("Dummy recommended Portfolio");
        this.getDummyBestPortfolio();
      }
    });
  }

  //ionViewDidLoad() {
    //this.declareTechnologies();
  //}

  // declareTechnologies() : void
  // {
  //   this.technologies = [
  //     {
  //       name: 'Whole Foods',
  //       risk: 'Moderate/Risky',
  //       image: 'assets/imgs/card-amsterdam.png',
  //       type: 'food'
  //     },
  //     {
  //       name: 'Tesla Motors',
  //       risk: 'Very Risky',
  //       image: 'assets/imgs/audi.jpg',
  //       type: 'auto'
  //     },
  //     {
  //       name: 'Facebook',
  //       risk: 'Low Risk',
  //       image: 'assets/imgs/work-7.jpg',
  //       type: 'tech'
  //     },
  //     {
  //       name: 'Twitter',
  //       risk: 'Very Risky',
  //       image: 'assets/imgs/moon.jpg',
  //       type: 'tech'
  //     }
  //   ];
  // }

  // filterTech(param : any) : void {
  //   this.declareTechnologies();
  //
  //   let val : string = param;
  //
  //   if(val.trim() !== '')
  //   {
  //     this.technologies = this.technologies.filter((item) =>
  //     {
  //       return item.name.toLowerCase().indexOf(val.toLowerCase()) >-1 || item.risk.toLowerCase().indexOf(val.toLowerCase()) >-1;
  //     })
  //   }
  //
  // }

//   onFilter(category : string) : void
//   {
//     this.declareTechnologies();
//     if (category.trim() !== 'all')
//       {
//          this.technologies = this.technologies.filter((item) =>
//          {
//            return item.type.toLowerCase().indexOf(category.toLowerCase()) > -1;
//          })
//        }
//   }
 }
