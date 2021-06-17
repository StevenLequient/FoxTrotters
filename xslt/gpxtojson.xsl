<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" encoding="ISO-8859-1"/>

<xsl:template match="/">

var rando = [
	<xsl:apply-templates select="trkseg"/>
];

</xsl:template>

<xsl:template match="trkseg/trkpt">
{
	"lat" : <xsl:value-of select="@lat"/>,
	"lng" : <xsl:value-of select="@lon"/>
},
</xsl:template>

</xsl:stylesheet>