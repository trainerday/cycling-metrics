import * as volume from './index';

test('one day of 70tss should be 1.67 tss', () => {
  const days = 30;
  const startCtl = 0;
  const dailyTss = getDailyTss();
  const res = volume.getCtl(dailyTss, days, startCtl);
  expect(res[0].ctl).toBe(1.7);
});

test('21 days of 70tss should be 27.8 tss', () => {
  const days = 30;
  const startCtl = 0;
  const dailyTss = getDailyTss();
  const res = volume.getCtl(dailyTss, days, startCtl);
  expect(res[20].ctl).toBe(27.8);
});

test('21 days of 70tss should be 32 tss on day 31', () => {
  const days = 30;
  const startCtl = 0;
  const dailyTss = getDailyTss();
  const res = volume.getCtl(dailyTss, days, startCtl);
  expect(res[30].ctl).toBe(32);
});

function getDailyTss(): number[] {
  const dailyTss = [];
  for (let i = 0; i <= 27; i++) {
    dailyTss.push(70);
  }
  return dailyTss;
}
