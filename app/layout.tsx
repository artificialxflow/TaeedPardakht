import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom mb-4" dir="rtl">
          <div className="container">
            <Link className="navbar-brand fw-bold" href="/">سامانه مدیریت پرداخت</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="تغییر منو">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="mainNavbar">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-2">
                <li className="nav-item">
                  <Link className="nav-link" href="/">داشبورد</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/projects">تعریف پروژه</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/users">مدیریت کاربران</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/payment-request">درخواست پرداخت</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/payment-approval">تایید پرداخت</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/reports">گزارشات</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
