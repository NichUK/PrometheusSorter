# PrometheusSorter

<p>This little Node/Express app attempts to bridge the annoying gap
between Prometheus who believe that sorting should be the domain
of the display layer, and Grafana who believe that sorting should
be done by the data layer.</p>

<p>Maybe one day of them will JFDI and this app will can be retired for good!</p>

<p>Usage:<br/>
<br/>
node app.js http://prometheus.url/api/v1<br/>
<br/>
then add:<br/>
<br/>
orderby(label) to sort alphabetically or <br/>
orderby(d(label)) to sort alphabetically descending<br/>
orderby(num(label)) to sort numerically to the end of a Prometheus query<br/>
orderby(numd(label)) to sort numerically descending<br/>
</p>

<p>Use or abuse this application for whatever purposes you like, business or
pleasure, but any problems you may encounter are entirely your own problem.</p>

<p>Pull requests welcome if you find a problem, or have a cool extension or deployment.</p>

<p>Nich<br/>
nich@nixnet.com</p>
