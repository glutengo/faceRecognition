import { FaceRecognitionPage } from './app.po';

describe('face-recognition App', () => {
  let page: FaceRecognitionPage;

  beforeEach(() => {
    page = new FaceRecognitionPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
