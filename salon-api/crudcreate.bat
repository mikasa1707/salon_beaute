@echo off

set /p MODULE=Nom du module (ex: produits) :
set /p ENTITY=Nom de l'entite (ex: produit) :

call nest generate module %MODULE%
call nest generate service %MODULE%
call nest generate controller %MODULE%

mkdir src\%MODULE%\entities 2>nul
mkdir src\%MODULE%\dto 2>nul

type nul > src\%MODULE%\entities\%ENTITY%.entity.ts
type nul > src\%MODULE%\dto\create-%ENTITY%.dto.ts
type nul > src\%MODULE%\dto\update-%ENTITY%.dto.ts

echo.
echo Module : %MODULE%
echo Entite : %ENTITY%
echo Generation terminee !
pause