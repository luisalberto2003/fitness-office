from playwright.sync_api import sync_playwright
import time

BASE = "http://localhost:5173"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 800})

    # 1. Home
    page.goto(BASE + "/")
    time.sleep(0.5)
    page.screenshot(path="01_home.png")

    # 2. Login
    page.goto(BASE + "/login")
    time.sleep(0.3)
    page.screenshot(path="02_login.png")

    # 3. Catalogo (publico)
    page.goto(BASE + "/catalogo")
    time.sleep(0.6)
    page.screenshot(path="03_catalogo.png")

    # 4. Login as admin
    page.goto(BASE + "/login")
    page.fill('input[type=email]', 'admin@fitnessoffice.com')
    page.fill('input[type=password]', 'Admin1234')
    page.click('button[type=submit]')
    time.sleep(1)
    page.screenshot(path="04_admin_dashboard.png")

    # 5. Admin Socios
    page.goto(BASE + "/admin/socios")
    time.sleep(0.6)
    page.screenshot(path="05_admin_socios.png")

    # 6. Admin Membresias
    page.goto(BASE + "/admin/membresias")
    time.sleep(0.6)
    page.screenshot(path="06_admin_membresias.png")

    # 7. Admin Productos
    page.goto(BASE + "/admin/productos")
    time.sleep(0.6)
    page.screenshot(path="07_admin_productos.png")

    # 8. Admin Pagos
    page.goto(BASE + "/admin/pagos")
    time.sleep(0.6)
    page.screenshot(path="08_admin_pagos.png")

    # logout and login as client
    page.evaluate("localStorage.clear()")
    page.goto(BASE + "/login")
    page.fill('input[type=email]', 'cliente@demo.com')
    page.fill('input[type=password]', 'Cliente1234')
    page.click('button[type=submit]')
    time.sleep(1)

    # 9. Catalogo as client + add to cart
    page.goto(BASE + "/catalogo")
    time.sleep(0.6)
    page.click('button:has-text("Agregar al carrito")')
    time.sleep(0.3)
    page.screenshot(path="09_catalogo_cliente.png")

    # 10. Carrito
    page.goto(BASE + "/carrito")
    time.sleep(0.5)
    page.fill('input[placeholder*="Amazonas"]', 'Av. Amazonas y Naciones Unidas, Quito')
    page.screenshot(path="10_carrito.png")

    browser.close()
    print("Capturas completadas")
