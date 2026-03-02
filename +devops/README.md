# Devops - workwear

## TL;DR

Backend: [https://workwear-develop-backend.dev.acide.win](https://palao-develop-backend.dev.acide.win)

Frontend: [https://workwear-develop-frontend.dev.acide.win](https://palao-develop-frontend.dev.acide.win)


### Configurar variables de entorno `NEXT_PUBLIC_`

Las variables `NEXT_PUBLIC_` se configurar en varios lugares:

1. Se deben declarar en el archivo `+devops/docker/Dockerfile`. Hay una seccion de ejemplo.

  Se colocan con `ARG`:

  ```Dockerfile
  ARG NEXT_PUBLIC_API_URL
  ARG NEXT_PUBLIC_API_URL
  ```

  En ese lugar solo se declaran, no se les asigna valor.

2. Se les asigna valor en los archivos Jenkinsfile.

  En las carpetas `+develop/Jenkinsfile`, `+staging/Jenkinsfile` y `+production/Jenkinsfile`
  se define el valor de las variables de entorno.

  ```groovy
    def buildVariables = [
      EXT_PUBLIC_BACKEND_URL: "https://teaminnovation-backend-develop.acide.win"
    ]
  ```

3. Los valores que se asignan en los archivos `vault.yml` no se toman en cuenta. Solo los valores en los Jenkinsfile.


### Configurar otras variables de entorno (no `NEXT_PUBLIC_`)

En windows, necesitas WSL.

En linux/macos, instala [Ansible](https://docs.ansible.com/ansible/latest/index.html) y utiliza `ansible-vault`
para ver y editar el archivo `+devops/+develop/vault.yml`. Reemplaza `+develop` con el entorno que desees.

```bash
ansible-vault edit +devops/+develop/vault.yml
```

Te pedirá la contraseña del vault. Está en el Vaultwarden de la empresa. Edita las variables, guarda el archivo
y súbelo a git.


### Ver logs del proceso de compilación/despliegue

Todos los logs de CI/CD por ramas y entornos estan en Jenkins.


### Ver logs del sistema desplegado

En grafana debe haber un dashboard con los logs.


### Acceder a la máquina virtual/base de datos/otros

Contactar al administrador.


## Estructura de archivos (`+devops/`)

- `+ci/`: Configuración de CI, para verificar que todas las ramas compilan y pasan tests antes de unir a develop.

  En particular, cuando la rama `develop`/`staging`/`main` compila exitosamente, se lanza automáticamente el proceso de despliegue.

  - `Jenkinsfile`: Script de Jenkins donde se define cómo se compila/prueba el proyecto.

- `+develop/`, `+staging/`, `+production/`: Configuración de despliegue para cada entorno.

  - `Jenkinsfile`: Compila el proyecto y lanza el despliegue con Ansible.
  - `docker-compose.<proyecto>.yml.j2`: Define el servicio a desplegar para el entorno correspondiente.
  - `vault.yml`: Variables de entorno específicas del entorno, encriptadas con Ansible Vault.

- `ansible/`: Playbooks y roles de Ansible para gestionar la infraestructura y el despliegue.
- `docker/`: Define la imagen Docker del proyecto, y el script para iniciar el sistema.



