import { Page } from '@playwright/test';
import { baseUrl } from '../constants';

export default class BasePage {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path?: string) {
    const url: string = path ? `${baseUrl}#/${path}` : baseUrl;
    await this.page.goto(url);
  }
}
