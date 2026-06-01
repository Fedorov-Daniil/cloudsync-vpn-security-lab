# CloudSync Royale

Публичная demo showcase страница для личного VPN / security homelab проекта.

Это статическая витрина для показа идеи проекта: стабильность, DNS-защита, мониторинг, бэкапы, rollback-first подход и аккуратная инфраструктура. Страница не является инструкцией подключения и не раскрывает production-детали.

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

Ожидаемый URL после Pages build:

```text
https://fedorov-daniil.github.io/cloudsync-vpn-security-lab/royale/
```

## Безопасность

Внутри используются только demo values и placeholders: `example.com`, `vpn.example.com`, `node.example.com`, `shield.example.com`, `203.0.113.10`, `Demo Node`, `Private Lab`, `Demo Values`, `REDACTED`.

Production VPN и live-конфиги не меняются.
