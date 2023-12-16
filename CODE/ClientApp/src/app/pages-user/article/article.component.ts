import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleView, CmsArticle } from 'src/app/_models/CmsArticle.model';
import { PageUserService } from '../pages-user.service';
import { CategoryView } from 'src/app/_models/CmsCategory.model';
import { PagePaging } from 'src/app/_models/PagePaging';
import { CmsSearch } from 'src/app/_models/SearchObject.model';
import { HomePage } from 'src/app/_models/HomePage.model';

@Component({
    selector: 'user-article',
    templateUrl: './article.component.html',
})
export class ArticleComponent implements OnInit {
    homePage?: HomePage = new HomePage();
    categoryView?: CategoryView = null;

    articleView?: CmsArticle = null;
    pageArticle: PagePaging<ArticleView> = new PagePaging();
    searchArticle: CmsSearch = new CmsSearch();

    constructor(private service: PageUserService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(this.getDataView);
    }

    get link() {
        return "/" + this.categoryView.slug + '/';
    }

    getDataView = async ({ category, article }) => {
        try {
            if (category) {
                const res = await this.service.getCategoryBySlug(category).toPromise();
                if (res && res.length > 0) {
                    this.categoryView = res[0];
                } else {
                    article = category;
                }
            }

            if (article) {
                const res = await this.service.getArticleBySlug(article).toPromise();
                this.articleView = new CmsArticle(res);
            } else {
                this.articleView = null;
                this.searchArticle.slug = category;
                this.getPageArticle();
                this.service.getHomePage().forEach(res => this.homePage = res);
            }

        } catch (error) {
            console.error(error);
        }
    }

    getPageArticle() {
        this.service.getPageArticleBySlug(this.searchArticle).subscribe({ next: res => this.pageArticle = res });
    }

    onChangePageIndex(event: { page: number }) {
        this.searchArticle.pageIndex = event.page;
        this.getPageArticle();
    }
}