# Ebrahim Hamidi — Portfolio

پورتفولیوی Next.js با سه منبع مستقل برای رزومه. در این مرحله، لایه داده و تست‌ها پیاده شده‌اند؛ اتصال صفحه سایت، خروجی PDF، دو زبان و تم در مراحل بعد انجام می‌شود.

## اجرا

از Node.js `22.23.1` و npm استفاده کن:

```bash
npm ci
npm run dev
```

سایت محلی: http://localhost:3000

## ساختار داده

```text
src/
  data/resumes/
    react.json
    react-native.json
    fullstack.json
  lib/resume/
    types.ts           # قرارداد TypeScript
    validate.ts        # بررسی داده و خطای دارای مسیر فیلد
    load.ts            # انتخاب رزومه و ساخت داده مشترک سایت
    validate.test.ts
    load.test.ts
    test-fixtures.ts
```

هر JSON دارای پنج کلید `basics`, `work`, `projects`, `skills`, `education` است. `name` و `email` در `basics` ضروری‌اند و چهار مجموعه دیگر همیشه آرایه‌اند؛ خالی بودن آرایه مجاز است. Fullstack فعلاً اطلاعات پایه و آرایه‌های خالی دارد تا تجربه تأییدنشده اضافه نشود.

`getResume("react-native")` داده همان فایل را برای مصرف‌کننده رزومه برمی‌گرداند. `buildPortfolio()` تجربه‌ها و پروژه‌های هر سه فایل را برای مصرف‌کننده سایت ترکیب می‌کند. این دو تابع هنوز به صفحه یا سازنده PDF متصل نشده‌اند.

```ts
import { buildPortfolio, getResume } from "@/lib/resume/load";

const resume = getResume("react-native");
const portfolio = buildPortfolio();
```

فایل‌های JSON به صورت static import وارد برنامه می‌شوند. در توسعه، ذخیره فایل و اجرای دوباره مصرف‌کننده داده، تغییر را منعکس می‌کند؛ برای سایت منتشرشده باید تغییرات را commit و push کنی و استقرار جدید Vercel موفق شود. این روش به پنل مدیریت یا پایگاه داده نیاز ندارد. پس از اتصال UI و PDF، هر دو از همین توابع داده می‌گیرند.

## افزودن تجربه و پروژه

هر تجربه یا پروژه یک `id` ثابت و غیرخالی دارد. تغییر عنوان یا توضیحات نباید شناسه را تغییر دهد. تکرار ID در یک آرایه از یک فایل خطاست؛ استفاده از همان ID در رزومه‌های مختلف مجاز است. برای دو سمت متفاوت در یک شرکت، دو ID متفاوت بده. تجربه‌ها و پروژه‌ها فضای شناسه مستقل دارند.

در خروجی مشترک سایت، ترتیب اولویت `react`، سپس `react-native` و سپس `fullstack` است. اگر یک ID در چند فایل باشد، اولین رکورد کامل استفاده می‌شود و متن‌ها با هم ادغام نمی‌شوند. ترتیب آرایه‌ها حفظ می‌شود. رزومه هر پروفایل، متن مخصوص همان پروفایل را نگه می‌دارد؛ بنابراین تغییر رکورد تکراری در React Native، نسخه مشترک دارای اولویت React را تغییر نمی‌دهد.

نمونه تجربه برای افزودن به آرایه `work`:

```json
{
  "id": "new-company-mobile",
  "company": "New company",
  "position": "React Native Engineer",
  "location": "Remote",
  "startDate": "2026-10",
  "highlights": ["Describe the actual work you completed."]
}
```

تاریخ‌ها `YYYY-MM` هستند. اگر منبع فقط سال دارد، `YYYY` هم پذیرفته می‌شود؛ ماه حدسی اضافه نمی‌کنیم. برای شغل جاری `endDate` را حذف کن. پایان قطعاً قبل از شروع پذیرفته نمی‌شود؛ سال فاقد ماه، بازه همان سال در نظر گرفته می‌شود. دو مکان نامشخص در منبع React فعلاً با `Location not specified` مشخص شده‌اند.

نمونه پروژه برای افزودن به آرایه `projects`:

```json
{
  "id": "new-mobile-app",
  "title": "New mobile app",
  "description": "Describe the product and your contribution.",
  "type": "mobile",
  "technologies": ["React Native", "TypeScript"],
  "image": "/images/projects/new-mobile-app.png",
  "links": { "website": "https://example.com/" }
}
```

`type` یکی از `web`، `mobile` یا `both` است. `image` و `links` اختیاری‌اند؛ بدون تصویر یا لینک تأییدشده آن‌ها را حذف کن. تصویر نمونه بالا در `public/images/projects/new-mobile-app.png` قرار می‌گیرد؛ مسیر باید زیر `/images/` و بدون traversal، query یا URL escape باشد. وجود فایل تصویر توسط اعتبارسنجی فعلی بررسی نمی‌شود. لینک‌های مجاز `website`, `github`, `appStore`, `googlePlay` و پروتکل مجاز HTTP/HTTPS است. آرایه `technologies` می‌تواند خالی باشد؛ برای Wonderfruit استک تأییدنشده اضافه نکرده‌ایم.

## تست و CI

```bash
npm test
npm run test:watch
npm run typecheck
npm run lint
```

Vitest در محیط Node، اعتبارسنجی، انتخاب پروفایل، حذف تکرارها، اولویت‌ها، حفظ ورودی و تغییر خروجی با رکورد جدید را بررسی می‌کند. تست‌های واقعی JSON هم جلوی داده ناسازگار را می‌گیرند. تست مرورگر و تولید PDF پس از پیاده‌سازی آن بخش‌ها اضافه می‌شوند.

GitHub Actions روی `push` و `pull_request`، دستورهای `npm ci`، `npm test` و `npm run typecheck` را اجرا می‌کند. موفق شدن تست‌ها در GitHub جلوی استقرار خودکار Vercel را به‌تنهایی نمی‌گیرد؛ تنظیم گیت استقرار مرحله‌ای جداست.
