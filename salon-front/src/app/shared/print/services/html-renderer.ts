import { Injectable } from '@angular/core';
import { PrintDocument } from '../models/print-document';

@Injectable({
  providedIn: 'root',
})
export class HtmlRenderer {
  render(document: PrintDocument): string {
    let html = `

    <html>

    <head>

    <style>

    body {
      font-family: Arial, sans-serif;
      padding:20px;
    }


    h1 {
      text-align:center;
      margin-bottom:5px;
    }


    .subtitle {
      text-align:center;
      color:#666;
      margin-bottom:20px;
    }


    table {

      width:100%;
      border-collapse:collapse;
      margin-top:20px;

    }


    th {

      background:#eee;
      border:1px solid #ccc;
      padding:8px;

    }


    td {

      border:1px solid #ccc;
      padding:8px;

    }


    .info {

      margin-bottom:15px;

    }


    .total {

      font-size:18px;
      font-weight:bold;
      margin-top:20px;

    }


    </style>


    </head>


    <body>


    <h1>
      ${document.title}
    </h1>


    ${
      document.subtitle
        ? `<div class="subtitle">
        ${document.subtitle}
      </div>`
        : ''
    }

    `;

    for (const section of document.sections) {
      if (section.title) {
        html += `
        <h3>
          ${section.title}
        </h3>
        `;
      }

      // INFO

      if (section.type === 'INFO') {
        html += `
        <div class="info">
        `;

        section.items?.forEach(item => {
          html += `

          <div>

          <b>${item.label}</b> :
          ${item.value}

          </div>

          `;
        });

        html += `
        </div>
        `;
      }

      // TABLE

      if (section.type === 'TABLE') {
        html += `

        <table>

        <thead>

        <tr>

        `;

        section.columns?.forEach(col => {
          html += `
          <th>
          ${col.label}
          </th>
          `;
        });

        html += `

        </tr>

        </thead>


        <tbody>

        `;

        section.rows?.forEach(row => {
          html += `<tr>`;

          section.columns?.forEach(col => {
            html += `

            <td>
            ${row[col.field] ?? ''}
            </td>

            `;
          });

          html += `</tr>`;
        });

        html += `

        </tbody>

        </table>

        `;
      }

      // TOTAL

      if (section.type === 'TOTAL') {
        html += `

        <div class="total">

        `;

        section.items?.forEach(item => {
          html += `

          ${item.label} :
          ${item.value}

          `;
        });

        html += `

        </div>

        `;
      }
    }

    html += `

    </body>

    </html>

    `;

    return html;
  }
}
