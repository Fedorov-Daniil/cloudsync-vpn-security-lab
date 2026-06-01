# CloudSync Royale

Публичная showcase-витрина для личного VPN / security homelab проекта.

Страница показывает визуальный обзор проекта: стабильность, DNS-защиту, мониторинг, бэкапы, rollback-first подход и аккуратную инфраструктурную дисциплину. Это не инструкция подключения и не раскрытие production-деталей.

## Как открыть локально

Откройте файл:

```text
friends-showcase/index.html
```

Или запустите простой локальный preview без установки пакетов:

```bash
python3 -m http.server 8090 --directory friends-showcase
```

После проверки остановите процесс через `Ctrl+C`.

## Публичная копия

Версия для GitHub Pages синхронизируется в:

```text
docs/royale/
```

Ожидаемый URL:

```text
https://fedorov-daniil.github.io/cloudsync-vpn-security-lab/royale/
```

## Безопасность

Внутри используются только public-safe значения и очищенные labels: `example.com`, `vpn.example.com`, `node.example.com`, `shield.example.com`, `203.0.113.10`, `Private Lab`, `REDACTED`.

Production VPN и live-конфиги не меняются.
