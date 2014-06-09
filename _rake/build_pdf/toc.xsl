<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:outline="http://wkhtmltopdf.org/outline"
                xmlns="http://www.w3.org/1999/xhtml">
  <xsl:output doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
              doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
              indent="yes"/>
  <xsl:template match="outline:outline">
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style>
          * {
            padding: 0;
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
          }

          .book-toc-title {
            margin-bottom: 1em;
          }

          .book-toc-list {

          }

          .book-toc-list .book-toc-list {

          }

          .book-toc-item {
            list-style-type: none;
          }

          .book-toc-item .book-toc-item {
            list-style-type: none;
            list-style-position: outside;
            font-size: 14px;
            margin: 0.2em 0 0 2em;
            padding-top: 0.2em;
          }

          .book-toc-item.level_1 {padding-top: 1em; margin-bottom: 0.2em}
          .book-toc-item.level_1:first-child {display: none;}
          .book-toc-item.level_2 {padding-bottom: 0.2em;}
          .book-toc-item.level_3 {}

          .book-toc-item-inner {
          }

          .book-toc-item-title {
            display: block;
            padding-bottom: 5px;
            font-size: 16px;
            font-weight: bold;
          }

          .book-toc-item-title .text {
            display: block;
            border-bottom: 1px dotted #000;
            height: 18px;
          }

          .book-toc-item-title .text-inner {
            background-color: #fff;
            line-height: 30px;
            padding-right: 7px;
          }

          .book-toc-item .book-toc-item .book-toc-item-title {
            font-weight: normal;
          }

          .book-toc-item-pagenum {
            position: relative;
            float: right;
            top: 5px;
            paddig-bottom: 0;
            padding-left: 5px;
            font-size: 14px;
            line-height: 20px;
            text-align: right;
            background-color: #fff;
          }
        </style>
      </head>
      <body>
        <h1 class="book-toc-title">Table of Contents</h1>
        <ol class="book-toc-list">
          <xsl:apply-templates select="outline:item/outline:item"/>
        </ol>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="outline:item[count(ancestor::outline:item)&lt;=2]">
    <li class="book-toc-item level_{count(ancestor::outline:item)}">
      <xsl:if test="@title!=''">
        <div class="book-toc-item-inner">

          <span class="book-toc-item-pagenum">
            <xsl:value-of select="@page"/>
          </span>

          <a class="book-toc-item-title">
            <xsl:if test="@link">
              <xsl:attribute name="href">
                <xsl:value-of select="@link"/>
              </xsl:attribute>
            </xsl:if>

            <xsl:if test="@backLink">
              <xsl:attribute name="name">
                <xsl:value-of select="@backLink"/>
              </xsl:attribute>
            </xsl:if>

            <span class="text">
              <span class="text-inner">
                <xsl:value-of select="@title"/>
              </span>
            </span>
          </a>

        </div>
      </xsl:if>

      <ol class="book-toc-list">
        <xsl:comment>added to prevent self-closing tags in QtXmlPatterns</xsl:comment>
        <xsl:apply-templates select="outline:item"/>
      </ol>
    </li>
  </xsl:template>
</xsl:stylesheet>
